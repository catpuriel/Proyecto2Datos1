/*
        Esta es la clase para el servicio de ruta se tiene un grafo asignado, una sede de donde sale
        el vehiculo, su ubicacion actual, tiempo acumulado y hora de salida que tiene que ser 11 o 15
*/
public class RoutingService
{
    private Graph grafo;
    private string sede;                          // de dónde sale siempre el vehículo

    public string UbicacionActualVehiculo { get; private set; }
    public int TiempoAcumuladoMinutos { get; private set; }
    public int HoraSalida { get; private set; }   // 11 o 15

    //Este es el constructor, pide un grafo y una sede inicial, si la sede no existe en el grafo,
    //pues no existe y da error, por ahora la hora de salida se pone siempre directamente a las 11
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

//-----------------------------------Aqui estan los metodos-------------------------------------

    // Reinicia el estado para una nueva salida: vuelve a la sede y el reloj a 0
    // Cada sede hace dos salidas diarias: 11am (11) y 3pm (15) (hora militar)
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
        int o = grafo.IndexOf(origen); //saca el indice del origen
        int d = grafo.IndexOf(destino); //indice del destino
        if (o == -1 || d == -1) return false; //si alguno directamente no existe da false

        //Se corre Dijkstra en el grafo, origen en o, luego se retorna true o false,
        //false si es Inifinty (no se puede llegar), true si se puede llegar
        Dijkstra.Run(grafo, o, out int[] dist, out int[] prev);
        return dist[d] != Dijkstra.Infinity;
    }

    // Mueve el vehículo a un destino, sumando el tiempo, devuelve false si del todo no se puede
    public bool MoverA(string destino)
    {
        int actual = grafo.IndexOf(UbicacionActualVehiculo); //Donde esta ahorita
        int d = grafo.IndexOf(destino); //Donde quiere ir
        if (d == -1) return false; //Directamente si no se puede llegar da false

        //Dijkstra: Sale de la posicion actual, vamos a ver si se puede llegar
        Dijkstra.Run(grafo, actual, out int[] dist, out int[] prev);
        if (dist[d] == Dijkstra.Infinity) return false; //Si no se puede (Infinity) da false, listo

        //Si se puede, eso de arriba no pasó, entonces se le suma el tiempo acumulado en minutos
        //y se cambia la ubicacion actual del vehiculo para ser el nombre de la ubicacion
        TiempoAcumuladoMinutos += dist[d];
        UbicacionActualVehiculo = grafo.GetName(d);

        //retorna true porque si lo logro
        return true;
    }
}