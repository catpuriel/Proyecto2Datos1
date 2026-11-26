public class RutaGrafo
{
    public string Id { get; set; }
    public string Origen { get; set; }
    public string Destino { get; set; }
    public int Tiempo { get; set; }

    public RutaGrafo(string id, string origen, string destino, int tiempo)
    {
        Id = id;
        Origen = origen;
        Destino = destino;
        Tiempo = tiempo;
    }
}