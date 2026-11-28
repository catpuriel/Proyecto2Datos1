using System.Text.Json;
using ConviTEC.Models;
using ProyectoDatos2.Models;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

/* Las sedes usan acronimos para no escribir todo el nombre.
Son constantes que se utilizan para indicar que el mensaje y la cola responda a una sede en especifico
Las sedes son:
    San José: SAN
    Limón: LIM
    Liberia: LIB
    Alajuela: ALA */

namespace ConviTEC.Services;

public class RabbitMqService
{
    private readonly ConnectionFactory factory; //Crea como la fabrica en donde van a ir los mensajes. No sé como explicarlo xd
    private IConnection? connection; // Es la conexión entre la maquina al broker
    private IChannel? publisherChannel; // Hace un canal en donde se publicaran los mensajes
    private IChannel? consumerChannel; // Es el canal en donde se reciben los mensajes
    private IChannel? inventoryConsumerChannel; //Aqui se anuncia los inventarios
    private const string ExchangeSedes = "convitec.sedes"; //Constantes de las Sedes
    private const string ExchangeInventario = "convitec.inventario"; //Es otra constante para ver el inventarip

/* Metodo creador
    Utiliza conexión local para el rabbit. Si hay plata podemos ponerlo en la nube.
    Si quieren ver la pagina el usuario es convitec y la contraseña esta en el archivo .env
    Van a tener que crearlo para probarlo.
    RECUERDENME PONER LAS INSTRUCCIONES EN EL README PARA QUE PUEDAN ACCEDER */
    public RabbitMqService()
    {
        string host = Environment.GetEnvironmentVariable("RABBITMQ_HOST") ?? "localhost";
        string username = Environment.GetEnvironmentVariable("RABBITMQ_USER")
            ?? throw new InvalidOperationException("Falta configurar RABBITMQ_USER.");
        string password = Environment.GetEnvironmentVariable("RABBITMQ_PASSWORD")
            ?? throw new InvalidOperationException("Falta configurar RABBITMQ_PASSWORD.");
        
        factory = new ConnectionFactory
        {
            HostName = host,
            UserName = username,
            Password = password
        };
        
    }
    public async Task IniciarAsync() //Inicia la conexión del rabbit
    {
        connection ??= await factory.CreateConnectionAsync();
        publisherChannel ??= await connection.CreateChannelAsync();
        await publisherChannel.ExchangeDeclareAsync(exchange: ExchangeSedes,type: ExchangeType.Direct,durable: true);
        await publisherChannel.ExchangeDeclareAsync(exchange: ExchangeInventario,type: ExchangeType.Fanout,durable: true);
        string[] sedes = { "LIB", "ALA", "SJ", "LIM" };
        foreach (string sede in sedes) //Crea una cola por cada sede
        {
            string cola = $"sede.{sede}";
            await publisherChannel.QueueDeclareAsync(queue: cola,durable: true,exclusive: false,autoDelete: false);
            await publisherChannel.QueueBindAsync(queue: cola,exchange: ExchangeSedes,routingKey: cola);
            string colaInventario = $"inventario.{cola}";
            await publisherChannel.QueueDeclareAsync(queue: colaInventario,durable: true,exclusive: false,autoDelete: false);
            await publisherChannel.QueueBindAsync(queue: colaInventario,exchange: ExchangeInventario,routingKey: string.Empty);
        }
    }
    public async Task SolicitarPedidoAsync(string tipo, string sedeOrigen, string sedeDestino) //Literal manda un mensaje para el pedido
    {
        if (publisherChannel is null)
            throw new InvalidOperationException("Primero llama a IniciarAsync.");
        var mensaje = new MensajeRabbit(tipo, sedeOrigen, sedeDestino);
        byte[] body = JsonSerializer.SerializeToUtf8Bytes(mensaje);
        string routingKey = $"sede.{sedeDestino}";
        var properties = new BasicProperties { Persistent = true };
        await publisherChannel.BasicPublishAsync(exchange: ExchangeSedes,routingKey: routingKey,mandatory: true,basicProperties: properties,body: body);
    }
    public async Task PublicarActualizacionInventarioAsync(ExistenciaSede existencia) //Manda un mensaje con el inventario acutalizado
    {
        if (publisherChannel is null)
            throw new InvalidOperationException("Primero llama a IniciarAsync.");
        byte[] body = JsonSerializer.SerializeToUtf8Bytes(existencia);
        var properties = new BasicProperties { Persistent = true };
        await publisherChannel.BasicPublishAsync(exchange: ExchangeInventario,routingKey: string.Empty,mandatory: false,basicProperties: properties,body: body);
    }
    public async Task EscucharAsync(string sedeId, Func<MensajeRabbit, Task> procesarMensaje) //Escucha la cola
    {
        if (connection is null)
            throw new InvalidOperationException("Primero llama a IniciarAsync.");
        IChannel channel = consumerChannel ??= await connection.CreateChannelAsync();
        string cola = $"sede.{sedeId}";
        var consumer = new AsyncEventingBasicConsumer(channel);
        consumer.ReceivedAsync += async (_, entrega) =>
        {
            MensajeRabbit? mensaje = JsonSerializer.Deserialize<MensajeRabbit>(entrega.Body.Span);
            if (mensaje is null)
                throw new InvalidDataException("El mensaje recibido no es válido.");
            await procesarMensaje(mensaje);
            await channel.BasicAckAsync(deliveryTag: entrega.DeliveryTag, multiple: false);
        };
        await channel.BasicConsumeAsync(queue: cola,autoAck: false,consumer: consumer);
    }
    public async Task EscucharActualizacionesInventarioAsync(string sedeId,Func<ExistenciaSede, Task> procesarActualizacion) //Escucha el inventario actualizado
    {
        if (connection is null)
            throw new InvalidOperationException("Primero llama a IniciarAsync.");
        IChannel channel = inventoryConsumerChannel ??= await connection.CreateChannelAsync();
        string cola = $"inventario.sede.{sedeId}";
        var consumer = new AsyncEventingBasicConsumer(channel);
        consumer.ReceivedAsync += async (_, entrega) =>
        {
            ExistenciaSede? existencia = JsonSerializer.Deserialize<ExistenciaSede>(entrega.Body.Span);
            if (existencia is null)
                throw new InvalidDataException("La actualización de inventario no es válida.");
            await procesarActualizacion(existencia);
            await channel.BasicAckAsync(deliveryTag: entrega.DeliveryTag, multiple: false);
        };
        await channel.BasicConsumeAsync(queue: cola,autoAck: false,consumer: consumer);
    }
}
