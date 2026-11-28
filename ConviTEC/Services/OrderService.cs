using ConviTEC.Models;
using ConviTEC.Structures;

namespace ConviTEC.Services;

public static class OrderService
{
    public static Pedido[] CrearPedido(
        Pedido pedido,
        Pedido[] historial,
        string rutaArchivoPedidos)
    {
        ArgumentNullException.ThrowIfNull(pedido);
        ArgumentNullException.ThrowIfNull(historial);

        foreach (Pedido existente in historial)
        {
            if (existente.Id == pedido.Id)
                throw new InvalidOperationException($"Ya existe el pedido {pedido.Id}.");
        }

        bool valido =
            !string.IsNullOrWhiteSpace(pedido.Id) &&
            !string.IsNullOrWhiteSpace(pedido.Destino) &&
            pedido.Detalles is { Length: > 0 };

        if (valido)
        {
            foreach (DetallePedido detalle in pedido.Detalles)
            {
                if (detalle is null ||
                    string.IsNullOrWhiteSpace(detalle.CodigoProducto) ||
                    detalle.Cantidad <= 0 ||
                    detalle.PrecioUnitario < 0)
                {
                    valido = false;
                    break;
                }
            }
        }

        pedido.Estado = valido ? "Pendiente" : "Rechazado";

        var pedidosActualizados = new ArregloDinamico<Pedido>();
        foreach (Pedido existente in historial)
            pedidosActualizados.Agregar(existente);

        pedidosActualizados.Agregar(pedido);
        Pedido[] resultado = pedidosActualizados.AArreglo();
        PersistenceService.Guardar(rutaArchivoPedidos, resultado);
        return resultado;
    }
}
