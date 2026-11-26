namespace ConviTEC.Models;  // Mantiene el modelo en el mismo espacio de nombres.
public class DetallePedido // Representa un producto solicitado dentro del pedido.
{
    public string CodigoProducto {get; set;} = string.Empty; // Código que identifica el producto.
    public int Cantidad {get; set;} // Número de unidades solicitadas.
    public decimal PrecioUnitario {get; set;} // Precio por unidad; decimal es apropiado para dinero.
}