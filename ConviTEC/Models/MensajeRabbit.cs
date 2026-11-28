namespace ConviTEC.Models; // Mantiene el mensaje junto a los modelos del proyecto.

public class MensajeRabbit // Define los datos que una sede enviará a otra por RabbitMQ.
{
    public string Tipo { get; set; } = string.Empty; // Tipo de operación, por ejemplo RESERVAR_STOCK.
    public string PedidoId { get; set; } = string.Empty; // Pedido relacionado con el mensaje.
    public string SedeOrigen { get; set; } = string.Empty; // Sede que envía la solicitud.
    public string SedeDestino { get; set; } = string.Empty; // Sede a la que se dirige.
    public DetallePedido[] Detalles { get; set; } = new DetallePedido[0]; // Productos y cantidades involucrados.
    public MensajeRabbit(){}
    public MensajeRabbit(string tipo, string sedeO, string sedeD)
    {
        Tipo = tipo;
        SedeOrigen = sedeO;
        SedeDestino = sedeD;
        PedidoId = GeneradorID();
    }
    private string GeneradorID()
    {
        Guid nuevoId = Guid.NewGuid();
        PedidoId = nuevoId.ToString(); 
        return PedidoId;
    }
}