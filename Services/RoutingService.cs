public class RoutingService
{
    private Graph grafo;
    private string sede;                          // de dónde sale siempre el vehículo

    public string UbicacionActualVehiculo { get; private set; }
    public int TiempoAcumuladoMinutos { get; private set; }
    public int HoraSalida { get; private set; }   // 11 o 15

    public RoutingService(Graph grafo, string sede)
    {
        if (grafo.IndexOf(sede) == -1)
            throw new ArgumentException("La sede no existe en el grafo: " + sede);

        this.grafo = grafo;
        this.sede = sede;
        UbicacionActualVehiculo = sede;   // el vehículo empieza en la sede
        TiempoAcumuladoMinutos = 0;
        HoraSalida = 11;
    }

    // Reinicia el estado para una nueva salida: vuelve a la sede y el reloj a 0.
    // Cada sede hace dos salidas diarias: 11:00 a.m. (11) y 3:00 p.m. (15).
    public void IniciarNuevaSalida(int hora)
    {
        if (hora != 11 && hora != 15)
            throw new ArgumentException("Las salidas son a las 11 o a las 15.");

        HoraSalida = hora;
        UbicacionActualVehiculo = sede;
        TiempoAcumuladoMinutos = 0;
    }

    // ¿Se puede llegar de origen a destino? (false si alguno no existe)
    public bool EsDestinoAlcanzable(string origen, string destino)
    {
        int o = grafo.IndexOf(origen);
        int d = grafo.IndexOf(destino);
        if (o == -1 || d == -1) return false;

        Dijkstra.Run(grafo, o, out int[] dist, out int[] prev);
        return dist[d] != Dijkstra.Infinity;
    }

    // Mueve el vehículo a un destino, sumando el tiempo. Devuelve false si no se puede.
    public bool MoverA(string destino)
    {
        int actual = grafo.IndexOf(UbicacionActualVehiculo);
        int d = grafo.IndexOf(destino);
        if (d == -1) return false;

        Dijkstra.Run(grafo, actual, out int[] dist, out int[] prev);
        if (dist[d] == Dijkstra.Infinity) return false;

        TiempoAcumuladoMinutos += dist[d];
        UbicacionActualVehiculo = grafo.GetName(d);
        return true;
    }
}