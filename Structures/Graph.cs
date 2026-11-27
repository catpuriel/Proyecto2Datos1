using System.Text.Json;
public class Graph
{
    public const int NoEdge = -1;   // no hay camino directo si esta en -1

    private string[] names {get; set;}         // lista con los nombres
    private int[,] matrix;          // la tabla de tiempos
    private int count;              // cantidad de lugares qu hay


    //------------------------------Constructor por json:-----------------------------------------

    // "static" = se llama sobre la clase (Graph.LoadFromJson(...)), no sobre un grafo ya creado
    // Crea un grafo nuevo, lo llena con las rutas del archivo y lo devuelve
    public static Graph LoadFromJson(string path)
    {
        // Si el archivo no existe, avisa con un mensaje claro
        if (!File.Exists(path))
            throw new FileNotFoundException("No se encontró el archivo: " + path);

        // Lee todo el archivo como un solo texto
        string text = File.ReadAllText(path);

        // Convierte ese texto en algo que se puede recorrer
        // "using" hace que se libere la memoria solo cuando termine
        using JsonDocument doc = JsonDocument.Parse(text);

        // Del json entero, se queda con el arreglo rutas
        JsonElement rutas = doc.RootElement.GetProperty("rutas");

        Graph g = new Graph(2);   // empieza pequeño y el resize se encarga de crecerlo

        // Recorre cada ruta del arreglo
        foreach (JsonElement ruta in rutas.EnumerateArray())
        {
            string origen = ruta.GetProperty("origen").GetString()!;
            string destino = ruta.GetProperty("destino").GetString()!;
            int tiempo = ruta.GetProperty("tiempo").GetInt32();

            // Caso especial: un tiempo de 0 o negativo no tiene sentido
            if (tiempo <= 0)
                throw new InvalidDataException("Tiempo inválido en la ruta " + origen + " - " + destino);

            // agregar el camino al grafo (la parte más importante)
            g.AddEdge(origen, destino, tiempo);
        }

        // retorna el grafo
        return g;
    }

    //------------------------------------Constructor normal:-----------------------------------------
    public Graph(int capacity = 2) 
    // lo de la capacidad es para poner la cantidad
    // de ubicaciones minimas que habra
    {
        names = new string[capacity];
        matrix = new int[capacity, capacity];
        for (int i = 0; i < capacity; i++)
            for (int j = 0; j < capacity; j++)
                matrix[i, j] = NoEdge;
                // porque al inicio no hay ningún camino
        count = 0;
    }

    //-----------------------------------------Metodos:------------------------------------------------
    public int VertexCount => count;

    public string GetName(int index) => names[index];

    public int GetWeight(int i, int j) => matrix[i, j];

    // Devuelve el número del lugar, o -1 si no existe
    public int IndexOf(string name)
    {
        for (int i = 0; i < count; i++)
            if (names[i] == name) return i;
        return -1;
    }

    // Agrega el lugar si no existe y devuelve su numero
    public int AddVertex(string name)
    {
        int existing = IndexOf(name);
        if (existing != -1) return existing;
        if (count == names.Length) resize();
        names[count] = name;
        count++;
        return count - 1;
    }

    // Agregar un camino de ida y vuelta
    // Por cierto, aqui tambien si no existe alguno de los dos vertices, se añaden
    public void AddEdge(string a, string b, int minutes)
    {
        int i = AddVertex(a);
        int j = AddVertex(b);
        matrix[i, j] = minutes;
        matrix[j, i] = minutes;
    }

    //Esta funcion privada aumenta el tamaño de la lista de nombres y la matriz al doble de su tamaño original
    private void resize()
    {
        //Tamaño actual
        int current_length = this.names.Length;
        //Capacidad nueva (el doble)
        int newCapacity = current_length * 2;
        //Nueva lista para los nombres del doble de capacidad 
        string[] newNames = new string[newCapacity];
        //Nueva matriz del doble de capacidad
        int[,] newMatrix = new int[newCapacity, newCapacity];

        //Aqui doble for super sencillo solo se aumentan 2 variables v y j uno cada que pasa una iteracion
        //y si v es menor al largo actual, hace que a la nueva lista para los nombres le asigne en el valor v
        //el mismo valor que tenia en la lista original, lo mismo con la matriz pero con v y j
        for (int v = 0; v < newCapacity; v++)
        {
            if (v < current_length) {newNames[v] = this.names[v];}
            for (int j = 0; j < newCapacity; j++)
            {
                if (v < current_length && j < current_length) {newMatrix[v, j] = this.matrix[v,j];} else {newMatrix[v,j] = NoEdge;}
            }
        }
        //Finalmente, this.matrix y this.names van a ser los nuevos que se crearon en este resize
        this.matrix = newMatrix;
        this.names = newNames;
    }
}