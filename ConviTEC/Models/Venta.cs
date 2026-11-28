namespace ConviTEC.Models; // Agrupa la venta con los demás modelos.

public class Venta // Representa una venta completada.
{
    public string Id { get; set; } = string.Empty; // Identificador único de la venta.
    public string PedidoId { get; set; } = string.Empty; // Pedido que originó esta venta.
    public string SedeId { get; set; } = string.Empty; // Sede donde se registra la venta.
    public DateTime Fecha { get; set; } = DateTime.Now; // Fecha y hora del registro.
    public DetallePedido[] Detalles { get; set; } = new DetallePedido[0]; // Productos vendidos, cantidades y precios.
    public decimal MontoTotal { get; set; } // Total cobrado por la venta.
    public int TiempoTrasladoMinutos { get; set; }
    public decimal Rendimiento => TiempoTrasladoMinutos <= 0 ? 0 : MontoTotal / TiempoTrasladoMinutos;
}