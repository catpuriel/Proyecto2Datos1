//Hola se me habia olvidado decir que este archivo
//es meramente para pruebas, por ahora

//Aqui pueden encontrar algunas de las pruebas que he hecho
//para revisar resizing y el algoritmo de dijkstra,
//probablemente lo siga usando para otras pruebas hasta no tener
//un programa real finiquitado

// Prueba 1:

/*
//Nuevo grafo de tamaño 2 (por default)
Graph g = new Graph();
//Algunas rutas
g.AddEdge("San José", "Cartago", 45);
g.AddEdge("Cartago", "Paraíso", 15);
g.AddEdge("Liberia", "Cañas", 65);
g.AddEdge("Paraíso", "Turrialba", 45);
g.AddEdge("Turrialba", "Limón", 75);
g.AddEdge("San José", "Guápiles", 70);
g.AddEdge("Guápiles", "Siquirres", 55);
g.AddEdge("Siquirres", "Limón", 65);

//Corre el dijkstra del grafo g, empezando en San Jose (por indice), con la variable out dist
//y out prev, que seran retornadas al mismo tiempo al final de la ejecución de la funcion
Dijkstra.Run(g, g.IndexOf("San José"), out int[] dist, out int[] prev);

//Aqui se hace un for que durara por tantos vertices haya
for (int i = 0; i < g.VertexCount; i++)
{
    //Usando el dist dado anteriormente, va a decir si cada vertice es: inalcanzable si es infinito,
    //o retornar su tiempo si lo tiene
    if (dist[i] == Dijkstra.Infinity)
        Console.WriteLine(g.GetName(i) + ": inalcanzable");
    else
        Console.WriteLine(g.GetName(i) + ": " + dist[i] + " min");
}
*/

//Prueba 2:

//Da la ruta de donde esta guardado el json con las rutas
string ruta = Path.Combine(AppContext.BaseDirectory, "Data", "rutas.json");
//Carga el grafo desde el json
Graph g = Graph.LoadFromJson(ruta);
//Hace la busqueda de Dijkstra comun y corriente, saca dist y prev
Dijkstra.Run(g, g.IndexOf("San José"), out int[] dist, out int[] prev);
//El camino se guarda en una lista de strings
string[] camino = Dijkstra.GetPath(g, dist, prev, g.IndexOf("Limón"));
//Se imprime tiempo y el camino que sigue
Console.WriteLine("Tiempo: " + dist[g.IndexOf("Limón")] + " min");
Console.WriteLine("Camino: " + string.Join(" -> ", camino));