using System;
using ConviTEC.Models;

namespace ConviTEC.Structures;

// Clase auxiliar sencilla para guardar un pedido entregado junto con su monto y tiempo de traslado
public class PedidoRendimiento
{
    public string IdPedido { get; set; } = string.Empty;
    public string Destino { get; set; } = string.Empty;
    public decimal MontoTotal { get; set; }
    public int TiempoTrasladoMinutos { get; set; }

    // Formula de la rubrica: Rendimiento = Monto / Tiempo
    // Si el tiempo es 0 o menor, devolvemos 0 para evitar division entre cero
    public decimal CalcularRendimiento()
    {
        if (TiempoTrasladoMinutos <= 0)
        {
            return 0;
        }

        return MontoTotal / TiempoTrasladoMinutos;
    }
}

// Clase sencilla para devolver el resultado de la consulta de Producto Estrella
public class ProductoEstrellaResultado
{
    public string CodigoProducto { get; set; } = string.Empty;
    public int UnidadesVendidas { get; set; }
    public decimal IngresosTotales { get; set; }
}

// Implementacion propia de MergeSort y calculo de Producto Estrella
// Usa solamente arreglos nativos (T[]), sin List, Dictionary ni LINQ
public static class OrdenamientoPropio
{
    // Calcula el monto total de un Pedido recorriendo su arreglo de detalles
    public static decimal CalcularMontoPedido(Pedido pedido)
    {
        if (pedido == null || pedido.Detalles == null)
        {
            return 0;
        }

        decimal total = 0;
        for (int i = 0; i < pedido.Detalles.Length; i++)
        {
            DetallePedido d = pedido.Detalles[i];
            total += d.Cantidad * d.PrecioUnitario;
        }

        return total;
    }

    // Ordena un arreglo de pedidos entregados de menor a mayor rendimiento (Peores Pedidos primero)
    // Complejidad de MergeSort: O(n log n) en todos los casos
    public static void MergeSortPorRendimiento(PedidoRendimiento[] pedidos)
    {
        // Si el arreglo viene vacio o solo tiene 1 elemento, ya esta ordenado
        if (pedidos == null || pedidos.Length <= 1)
        {
            return;
        }

        OrdenarRecursivo(pedidos, 0, pedidos.Length - 1);
    }

    // Divide el arreglo en dos mitades hasta llegar a subarreglos de tamaño 1
    private static void OrdenarRecursivo(PedidoRendimiento[] arr, int inicio, int fin)
    {
        if (inicio >= fin)
        {
            return;
        }

        int medio = (inicio + fin) / 2;

        // Ordenamos mitad izquierda y mitad derecha
        OrdenarRecursivo(arr, inicio, medio);
        OrdenarRecursivo(arr, medio + 1, fin);

        // Mezclamos las dos mitades ya ordenadas
        Mezclar(arr, inicio, medio, fin);
    }

    // Mezcla dos subarreglos ordenados [inicio..medio] y [medio+1..fin] en orden ascendente
    private static void Mezclar(PedidoRendimiento[] arr, int inicio, int medio, int fin)
    {
        int tamIzq = medio - inicio + 1;
        int tamDer = fin - medio;

        // Arreglos temporales nativos para copiar cada mitad
        PedidoRendimiento[] izquierda = new PedidoRendimiento[tamIzq];
        PedidoRendimiento[] derecha = new PedidoRendimiento[tamDer];

        for (int i = 0; i < tamIzq; i++)
        {
            izquierda[i] = arr[inicio + i];
        }

        for (int j = 0; j < tamDer; j++)
        {
            derecha[j] = arr[medio + 1 + j];
        }

        int idxIzq = 0;
        int idxDer = 0;
        int k = inicio;

        // Comparamos el rendimiento de ambos lados y ponemos primero el menor
        // Usar <= mantiene el orden original cuando hay empates (ordenamiento estable)
        while (idxIzq < tamIzq && idxDer < tamDer)
        {
            if (izquierda[idxIzq].CalcularRendimiento() <= derecha[idxDer].CalcularRendimiento())
            {
                arr[k] = izquierda[idxIzq];
                idxIzq++;
            }
            else
            {
                arr[k] = derecha[idxDer];
                idxDer++;
            }
            k++;
        }

        // Copiamos lo que haya quedado en la mitad izquierda
        while (idxIzq < tamIzq)
        {
            arr[k] = izquierda[idxIzq];
            idxIzq++;
            k++;
        }

        // Copiamos lo que haya quedado en la mitad derecha
        while (idxDer < tamDer)
        {
            arr[k] = derecha[idxDer];
            idxDer++;
            k++;
        }
    }

    // Recorre todas las ventas y encuentra el producto que genero mayores ingresos
    // Ingresos por producto = suma de (Cantidad * PrecioUnitario)
    public static ProductoEstrellaResultado? CalcularProductoEstrella(Venta[] ventas)
    {
        if (ventas == null || ventas.Length == 0)
        {
            return null;
        }

        // Primero contamos cuantas lineas de detalle hay en total para dimensionar el arreglo nativo
        int maxLineas = 0;
        for (int i = 0; i < ventas.Length; i++)
        {
            if (ventas[i] != null && ventas[i].Detalles != null)
            {
                maxLineas += ventas[i].Detalles.Length;
            }
        }

        if (maxLineas == 0)
        {
            return null;
        }

        // Arreglo nativo para ir acumulando unidades e ingresos de cada producto unico
        ProductoEstrellaResultado[] acumulados = new ProductoEstrellaResultado[maxLineas];
        int cantidadUnicos = 0;

        for (int i = 0; i < ventas.Length; i++)
        {
            Venta venta = ventas[i];
            if (venta == null || venta.Detalles == null)
            {
                continue;
            }

            for (int j = 0; j < venta.Detalles.Length; j++)
            {
                DetallePedido det = venta.Detalles[j];
                if (det == null || det.Cantidad <= 0)
                {
                    continue;
                }

                decimal ingresoDetalle = det.Cantidad * det.PrecioUnitario;

                // Buscamos si este codigo de producto ya esta en el arreglo de acumulados
                int posicion = -1;
                for (int u = 0; u < cantidadUnicos; u++)
                {
                    if (acumulados[u].CodigoProducto == det.CodigoProducto)
                    {
                        posicion = u;
                        break;
                    }
                }

                if (posicion != -1)
                {
                    acumulados[posicion].UnidadesVendidas += det.Cantidad;
                    acumulados[posicion].IngresosTotales += ingresoDetalle;
                }
                else
                {
                    acumulados[cantidadUnicos] = new ProductoEstrellaResultado
                    {
                        CodigoProducto = det.CodigoProducto,
                        UnidadesVendidas = det.Cantidad,
                        IngresosTotales = ingresoDetalle
                    };
                    cantidadUnicos++;
                }
            }
        }

        if (cantidadUnicos == 0)
        {
            return null;
        }

        // Recorrido lineal para encontrar el producto con mayor ingreso total
        ProductoEstrellaResultado mejor = acumulados[0];
        for (int i = 1; i < cantidadUnicos; i++)
        {
            if (acumulados[i].IngresosTotales > mejor.IngresosTotales)
            {
                mejor = acumulados[i];
            }
        }

        return mejor;
    }
}
