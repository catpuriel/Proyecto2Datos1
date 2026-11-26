/*
        Esta clase es meramente para crear la ruta en el grafo, guarda el id,
        el origen, el destino y el tiempo,nada mas, solo son getters y setters,
        ahorita no tiene ninguna funcionalidad real, por como esta estructurado
        el proyecto, habra que ver si se deja o se quita para las versiones posteriores
*/
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