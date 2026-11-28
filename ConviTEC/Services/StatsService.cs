using System;
using ConviTEC.Models;
using ConviTEC.Structures;

namespace ConviTEC.Services;

// Objeto sencillo para devolver las 3 consultas de estadisticas juntas en /api/ventas/estadisticas
public class ResumenEstadisticas
{
    public Venta[] HistorialVentas { get; set; } = Array.Empty<Venta>();
    public ProductoEstrellaResultado? ProductoEstrella { get; set; }
    public PedidoRendimiento[] PeoresPedidos { get; set; } = Array.Empty<PedidoRendimiento>();
}

// Servicio encargado de las consultas de ventas, Producto Estrella y Peores Pedidos
// Usa solamente arreglos nativos (T[]) y los algoritmos propios de OrdenamientoPropio
public class StatsService
{
    // Filtra los pedidos validos y los ordena de menor a mayor rendimiento usando nuestro MergeSort
    public PedidoRendimiento[] ObtenerPeoresPedidos(PedidoRendimiento[]? pedidosEntregados)
    {
        if (pedidosEntregados == null || pedidosEntregados.Length == 0)
        {
            return Array.Empty<PedidoRendimiento>();
        }

        // Primero contamos cuantos pedidos tienen tiempo mayor a 0 para no dividir entre cero
        int validos = 0;
        for (int i = 0; i < pedidosEntregados.Length; i++)
        {
            if (pedidosEntregados[i] != null && pedidosEntregados[i].TiempoTrasladoMinutos > 0)
            {
                validos++;
            }
        }

        if (validos == 0)
        {
            return Array.Empty<PedidoRendimiento>();
        }

        // Copiamos a un arreglo nuevo para no modificar el orden del arreglo original
        PedidoRendimiento[] resultado = new PedidoRendimiento[validos];
        int indice = 0;

        for (int i = 0; i < pedidosEntregados.Length; i++)
        {
            if (pedidosEntregados[i] != null && pedidosEntregados[i].TiempoTrasladoMinutos > 0)
            {
                resultado[indice] = pedidosEntregados[i];
                indice++;
            }
        }

        // Llamamos a nuestro MergeSort propio (O(n log n))
        OrdenamientoPropio.MergeSortPorRendimiento(resultado);
        return resultado;
    }

    // Devuelve el producto que genero mas ingresos en el arreglo de ventas
    public ProductoEstrellaResultado? ObtenerProductoEstrella(Venta[]? ventas)
    {
        if (ventas == null || ventas.Length == 0)
        {
            return null;
        }

        return OrdenamientoPropio.CalcularProductoEstrella(ventas);
    }

    // Arma el resumen completo que consume el endpoint GET /api/ventas/estadisticas
    public ResumenEstadisticas ObtenerResumen(Venta[]? ventas, PedidoRendimiento[]? pedidosEntregados)
    {
        Venta[] historial = ventas ?? Array.Empty<Venta>();

        return new ResumenEstadisticas
        {
            HistorialVentas = historial,
            ProductoEstrella = ObtenerProductoEstrella(historial),
            PeoresPedidos = ObtenerPeoresPedidos(pedidosEntregados)
        };
    }

    // Helper para convertir arreglos de Pedido + tiempos de entrega en PedidoRendimiento[]
    public PedidoRendimiento[] ConstruirPedidosRendimiento(Pedido[]? pedidos, int[]? tiemposMinutos)
    {
        if (pedidos == null || tiemposMinutos == null || pedidos.Length == 0)
        {
            return Array.Empty<PedidoRendimiento>();
        }

        int limite = pedidos.Length < tiemposMinutos.Length ? pedidos.Length : tiemposMinutos.Length;

        // Contamos solo los que ya fueron entregados
        int cantEntregados = 0;
        for (int i = 0; i < limite; i++)
        {
            if (pedidos[i] != null && pedidos[i].Estado == "Entregado" && tiemposMinutos[i] > 0)
            {
                cantEntregados++;
            }
        }

        if (cantEntregados == 0)
        {
            return Array.Empty<PedidoRendimiento>();
        }

        PedidoRendimiento[] lista = new PedidoRendimiento[cantEntregados];
        int idx = 0;

        for (int i = 0; i < limite; i++)
        {
            Pedido p = pedidos[i];
            if (p != null && p.Estado == "Entregado" && tiemposMinutos[i] > 0)
            {
                lista[idx] = new PedidoRendimiento
                {
                    IdPedido = p.Id,
                    Destino = p.Destino,
                    MontoTotal = OrdenamientoPropio.CalcularMontoPedido(p),
                    TiempoTrasladoMinutos = tiemposMinutos[i]
                };
                idx++;
            }
        }

        return lista;
    }
}
