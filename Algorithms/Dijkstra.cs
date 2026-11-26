public static class Dijkstra
{
    public const int Infinity = int.MaxValue;   // significa "inalcanzable"

    // dist[i] = minutos mínimos desde 'source' hasta el lugar i
    // prev[i] = de qué lugar se viene para llegar a i (sirve para reconstruir la ruta)
    public static void Run(Graph g, int source, out int[] dist, out int[] prev)
    {
        //n es la cantidad de vertices en el grafo
        int n = g.VertexCount;
        dist = new int[n];
        prev = new int[n];
        //booleano para saber si ya se visito
        bool[] visited = new bool[n];

        for (int i = 0; i < n; i++)
        {
            //al inicio, todos son incalcanzables (infinitos) y no se llega desde ningun lugar (-1)
            dist[i] = Infinity;
            prev[i] = -1;
        }
        // el source (desde donde se sale) siempre es 0, al menos en este caso
        dist[source] = 0;

        for (int step = 0; step < n; step++)
        {
            // busca el lugar no revisado con menor tiempo
            int u = -1;
            for (int i = 0; i < n; i++)
            {
                if (visited[i] || dist[i] == Infinity) continue;
                if (u == -1 || dist[i] < dist[u]) u = i;
            }
            if (u == -1) break;      // los que quedan no se pueden alcanzar
            visited[u] = true;

            // revisa los vecinos de u
            for (int v = 0; v < n; v++)
            {
                int w = g.GetWeight(u, v);
                if (w == Graph.NoEdge || visited[v]) continue;

                if (dist[u] + w < dist[v])
                {
                    dist[v] = dist[u] + w;
                    prev[v] = u;
                }
            }
        }
    }
    // Aqui se reconstruye el camino
    public static string[] GetPath(Graph g, int[] dist, int[] prev, int target)
    {
    // Caso especial: el lugar no existe o no se puede llegar a él
    // Devuelve un arreglo vacío (0 elementos)
    if (target < 0 || target >= g.VertexCount || dist[target] == Infinity)
        return new string[0];

    // Primero!!!!! contar cuántos lugares tiene el camino
    // Empieza en el destino y va hacia atras con prev hasta llegar a -1
    int length = 0;
    int current = target;
    while (current != -1)
    {
        length++;
        current = prev[current];   // retrocede un lugar
    }

    // SEGUNDO!!!1!! ahora que sabe el tamaño, crea el arreglo
    string[] path = new string[length];

    // TERCEROPOPOPO!!!!! lo llena DESDE EL FINAL hasta el principio
    // Como retrocede desde el destino, el primer nombre que encuentra
    // va en la última posición y asi queda en orden origen - destino
    current = target;
    for (int k = length - 1; k >= 0; k--)
    {
        path[k] = g.GetName(current);
        current = prev[current];
    }

    return path;
    }
    //si yo soy evan y yo pongo esos comentarios re basura pero si no se me olvida que hice xd
}