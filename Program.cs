/*

                Hola se me habia olvidado decir que este archivo
                es meramente para pruebas, por ahora

                Aqui pueden encontrar algunas de las pruebas que he hecho
                para revisar resizing y el algoritmo de dijkstra,
                probablemente lo siga usando para otras pruebas hasta no tener
                un programa real finiquitado

*/

string ruta = Path.Combine(AppContext.BaseDirectory, "Data", "rutas.json");
Graph g = Graph.LoadFromJson(ruta);

Console.WriteLine("Lugares cargados: " + g.VertexCount);   // debería ser 16
Console.WriteLine();

Probar(g, "Liberia", "Cañas");      // 65 min
Probar(g, "Liberia", "Cartago");    // inalcanzable
Probar(g, "San José", "Limón");     // 180 min, por Turrialba
Probar(g, "San José", "Heredia");   // 20 min

RoutingService servicio = new RoutingService(g, "San José");
servicio.IniciarNuevaSalida(11);

Console.WriteLine();
Console.WriteLine("Liberia -> Cañas alcanzable: " + servicio.EsDestinoAlcanzable("Liberia", "Cañas"));     // True
Console.WriteLine("Liberia -> Cartago alcanzable: " + servicio.EsDestinoAlcanzable("Liberia", "Cartago")); // False

servicio.MoverA("Cartago");   // +45
servicio.MoverA("Paraíso");   // +15
Console.WriteLine("Ubicación: " + servicio.UbicacionActualVehiculo + ", tiempo: " + servicio.TiempoAcumuladoMinutos);
// Paraíso, 60

Console.WriteLine("Mover a Liberia: " + servicio.MoverA("Liberia"));   // False, y no cambia nada

// Función auxiliar: corre Dijkstra y muestra el resultado
static void Probar(Graph g, string origen, string destino)
{
    Dijkstra.Run(g, g.IndexOf(origen), out int[] dist, out int[] prev);
    int d = g.IndexOf(destino);

    if (dist[d] == Dijkstra.Infinity)
    {
        Console.WriteLine(origen + " -> " + destino + ": inalcanzable");
    }
    else
    {
        string camino = string.Join(" -> ", Dijkstra.GetPath(g, dist, prev, d));
        Console.WriteLine(origen + " -> " + destino + ": " + dist[d] + " min  (" + camino + ")");
    }
}