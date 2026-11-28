using ConviTEC.Models;
using ConviTEC.Structures;
namespace ConviTEC.Services;
//Metodo estatico para crear Pedidos
public static class OrderService
{
    public static Pedido[] CrearPedido(Pedido pedido,Pedido[] historial,string rutaArchivoPedidos)
    {
        ArgumentNullException.ThrowIfNull(pedido); //Rompe si el nulo
        ArgumentNullException.ThrowIfNull(historial); //Lo mismo que lo de arriba xd
        foreach (Pedido existente in historial) // busca si hay pedidos iguales en el historial
        {
            if (existente.Id == pedido.Id) // Tira el mensaje si hay un pedido igual
                throw new InvalidOperationException($"Ya existe el pedido {pedido.Id}.");
        }
        bool valido =!string.IsNullOrWhiteSpace(pedido.Id) &&!string.IsNullOrWhiteSpace(pedido.Destino) &&pedido.Detalles is { Length: > 0 };
        if (valido) //Verifica si el pedido es valido
        {
            foreach (DetallePedido detalle in pedido.Detalles)
            {
                if (detalle is null || string.IsNullOrWhiteSpace(detalle.CodigoProducto) || detalle.Cantidad <= 0 || detalle.PrecioUnitario < 0)
                {
                    valido = false;
                    break;
                }
            }
        }
        pedido.Estado = valido ? "Pendiente" : "Rechazado"; //asigna pendiente o rechazado dependiendo si cumple con lo establecido
        var pedidosActualizados = new ArregloDinamico<Pedido>(); //lo agrega al arreglo dinamico
        foreach (Pedido existente in historial)
            pedidosActualizados.Agregar(existente);
        pedidosActualizados.Agregar(pedido);
        Pedido[] resultado = pedidosActualizados.AArreglo();
        PersistenceService.Guardar(rutaArchivoPedidos, resultado);
        return resultado;
    }
}
