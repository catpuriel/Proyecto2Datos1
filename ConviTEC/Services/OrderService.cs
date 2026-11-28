using ConviTEC.Models;
using ConviTEC.Structures;
using ProyectoDatos2.Models;
namespace ConviTEC.Services;
//Clase de metodos para gestionar el servicio de las ordenes
public static class OrderService
{ //Crea el pedido
    public static Pedido[] CrearPedido(Pedido pedido,Pedido[] historial,ExistenciaSede[] inventario,string sedeId,string rutaArchivoPedidos,Func<string, bool> destinoAlcanzable)
    {
        ArgumentNullException.ThrowIfNull(pedido); //Tira null si los parametros estan vacios
        ArgumentNullException.ThrowIfNull(historial); //igual que arriba
        ArgumentNullException.ThrowIfNull(inventario); //igual que arriba
        ArgumentNullException.ThrowIfNull(destinoAlcanzable);//igual que arriba
        if (string.IsNullOrWhiteSpace(pedido.Id)) //le asigna un id si no viene con uno
            pedido.Id = Guid.NewGuid().ToString();
        foreach (Pedido existente in historial) //busca si el pedido esta en el historial para no repetirlo
        {
            if (existente.Id == pedido.Id)
                throw new InvalidOperationException(
                    $"Ya existe el pedido {pedido.Id}.");
        }
        bool valido = !string.IsNullOrWhiteSpace(pedido.Destino) && pedido.Detalles is { Length: > 0 }; //valora si el pedido es valido
        if (valido)
        {
            foreach (DetallePedido detalle in pedido.Detalles)
            { // Si se cumple la condición para y lo pone como rechazado
                if (detalle is null || string.IsNullOrWhiteSpace(detalle.CodigoProducto) ||detalle.Cantidad <= 0 ||detalle.PrecioUnitario < 0)
                {
                    valido = false;
                    break;
                }
            }
        }
        if (valido && !destinoAlcanzable(pedido.Destino)) //Busca si el destino es alcanzable
            valido = false;
        if (valido && !HayStockLocalSuficiente(pedido.Detalles, inventario)) //Busca si hay stock
            valido = false;
        pedido.SedeOrigen = sedeId; //asigna la sede de origen
        pedido.Estado = valido ? "Pendiente" : "Rechazado"; //asigna el estado del pedido
        Pedido[] historialActualizado = Agregar(historial, pedido); //actualiza el historial
        PersistenceService.Guardar(rutaArchivoPedidos, historialActualizado); //Guarda el pedido
        return historialActualizado;
    }
    public static (Pedido[] Pedidos, Venta[] Ventas, Venta VentaCreada)//Regista las entregas
        RegistrarEntrega(string pedidoId,Pedido[] pedidos,Venta[] ventas,string sedeId,int tiempoTrasladoMinutos,string rutaArchivoPedidos,string rutaArchivoVentas)
    {
        int indicePedido = -1;
        for (int i = 0; i < pedidos.Length; i++) // busca el indice del pedido
        {
            if (pedidos[i].Id == pedidoId)
            {
                indicePedido = i;
                break;
            }
        }
        if (indicePedido < 0) // Tira error si el indice no cumple
            throw new KeyNotFoundException($"No existe el pedido {pedidoId}.");
        Pedido pedido = pedidos[indicePedido];
        if (pedido.Estado != "Pendiente") //Verifica si esta en pendiente
            throw new InvalidOperationException("Solo se puede entregar un pedido Pendiente.");
        foreach (Venta ventaExistente in ventas) //Busca que el pedido no se haya vendido
        {
            if (ventaExistente.PedidoId == pedidoId)
                throw new InvalidOperationException($"El pedido {pedidoId} ya tiene una venta.");
        }
        decimal montoTotal = 0;
        foreach (DetallePedido detalle in pedido.Detalles) //calcula el monto
            montoTotal += detalle.Cantidad * detalle.PrecioUnitario;
        var venta = new Venta //Crea la venta
        {
            Id = Guid.NewGuid().ToString(),
            PedidoId = pedido.Id,
            SedeId = sedeId,
            Fecha = DateTime.Now,
            Detalles = pedido.Detalles,
            MontoTotal = montoTotal,
            TiempoTrasladoMinutos = tiempoTrasladoMinutos
        };
        pedido.Estado = "Entregado"; //Pone el pedido en Entregado y lo actualiza
        Pedido[] pedidosActualizados = (Pedido[])pedidos.Clone();
        Venta[] ventasActualizadas = Agregar(ventas, venta);
        PersistenceService.Guardar(rutaArchivoPedidos, pedidosActualizados);
        PersistenceService.Guardar(rutaArchivoVentas, ventasActualizadas);
        return (pedidosActualizados, ventasActualizadas, venta);
    }

    private static bool HayStockLocalSuficiente(DetallePedido[] detalles,ExistenciaSede[] inventario)
    { //Busca si hay stock 
        for (int i = 0; i < detalles.Length; i++)
        {
            bool productoYaRevisado = false;
            for (int anterior = 0; anterior < i; anterior++)
            {
                if (inventarioProductoIgual(detalles[anterior], detalles[i]))
                {
                    productoYaRevisado = true;
                    break;
                }
            }
            if (productoYaRevisado)
                continue;
            int cantidadSolicitada = 0;
            for (int j = 0; j < detalles.Length; j++)
            {
                if (inventarioProductoIgual(detalles[j], detalles[i]))
                    cantidadSolicitada += detalles[j].Cantidad;
            }
            int cantidadDisponible = 0;
            for (int j = 0; j < inventario.Length; j++)
            {
                if (string.Equals(
                    inventario[j].Producto,
                    detalles[i].CodigoProducto,
                    StringComparison.OrdinalIgnoreCase))
                {
                    cantidadDisponible += inventario[j].Cantidad;
                }
            }
            if (cantidadDisponible < cantidadSolicitada)
                return false;
        }
        return true;
    }
    private static bool inventarioProductoIgual(DetallePedido primero,DetallePedido segundo) //Devuelve el inventario
    {
        return string.Equals(
            primero.CodigoProducto,
            segundo.CodigoProducto,
            StringComparison.OrdinalIgnoreCase);
    }
    private static T[] Agregar<T>(T[] arreglo, T elemento) //Agrega el elemento al arreglo dinamico
    {
        var nuevoArreglo = new ArregloDinamico<T>();
        foreach (T existente in arreglo)
            nuevoArreglo.Agregar(existente);
        nuevoArreglo.Agregar(elemento);
        return nuevoArreglo.AArreglo();
    }
}