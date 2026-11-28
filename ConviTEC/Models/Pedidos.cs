namespace ConviTEC.Models; // Agrupa los modelos del proyecto web.

public class Pedido // Representa un pedido registrado en una sede.
{
    public string Id { get; set; } = string.Empty; // Identificador único del pedido.
    public DateTime FechaCreacion { get; set; } = DateTime.Now; // Momento en que se creó.
    public string Estado { get; set; } = "Pendiente"; // Estado actual del pedido.
    public string SedeOrigen { get; set; } = string.Empty; // Sede que registró el pedido.
    public string Destino { get; set; } = string.Empty; // Punto donde se solicita la entrega.
    public DetallePedido[] Detalles { get; set; } = new DetallePedido[0]; // Productos, cantidades y precios.
    public string[] SedesParticipantes { get; set; } = new string[0]; // Sedes que aportan productos al pedido.
    public Pedido(){}
    public Pedido(DateTime fecha, string estado, string sedeO, string destino, DetallePedido[] detalles, string[] sedeP)
    {
        FechaCreacion = fecha;
        Estado = estado;
        SedeOrigen = sedeO;
        Destino = destino;
        Detalles = detalles;
        SedesParticipantes = sedeP;
        Id = GeneradorID();
    }
    private string GeneradorID()
    {
        Guid nuevoId = Guid.NewGuid();
        Id = nuevoId.ToString(); 
        return Id;
    }
}