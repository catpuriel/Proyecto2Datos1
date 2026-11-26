# Proyecto 2 De Algoritmos y Estructuras de Datos I : ConviTEC | Rama: `feature/paso1-esqueleto`

## Programa ->
### **Data -> rutas.json:**
Informacion de todas las rutas disponibles dadas por el profe, en un listado .json mas facil de acceder

### **ConviTEC.Graphs.csproj:**
El archivo .csproj que toma en consideracion las rutas de la carpeta Data para `LoadFromJson(route)`

### **Dijkstra.cs:**
El archivo con la clase `Dijkstra`, que tiene toda la informacion y funcionalidades para encontrar la ruta mas cercana como el algoritmo estipula. Si no tiene una ruta, es inalcanzable, considerado como `Infinity`, y se llama por medio de:
`Dijkstra.Run(Graph g, int source, out int[] dist, out int[] prev)`.
Los out daran unas variables ya listas con: 
- Los minutos minimos desde `source` hasta el lugar `i` (`dist[i]`) al final de la ejecucion de la funcion
- Desde que lugar se viene para llegar a `i` (`prev[i]`)

### **Graph.cs:**
El archivo con la clase `Graph` estructural para la creacion de los grafos utilizados en el proyecto. Tiene dos diferentes constructores:
- `Graph LoadFromJson(string path)`
- `Graph(int capacity = 2)`

Los grafos tienen varios metodos, como:
- `AddVertex(string name)`: Retorna el indice del vertice, si ya existia o lo crea y retorna su indice asignado
- `AddEdge(string a, string b, int minutes)`: Crea un camino entre dos vertices, con peso minutes, utiliza `AddVertex` para añadirlos en caso de que no existan y que no reviente, modifica la matriz del grafo para tomar en cuenta el nuevo tiempo entre esos dos vertices
- `resize()`: Se llama automaticamente si se llega a la capacidad maxima del grafo, crea una nueva lista y una nueva matriz del doble del tamaño para guardar todos los datos viejos ahi y los nuevos datos que entren

### **Program.cs:**
Actualmente utilizado unicamente para pruebas relacionadas al algoritmo `Dijkstra` y las funcionalidades de los grafos.

## Models ->
### **ExistenciaSede.cs:**
Un `namespace` que representa la existencia de un producto en una sede

### **Producto.cs:**
Un `namespace` que representa un producto del catalogo

## SeedsJSON ->
### Aqui se pueden encontrar los catalogos de cada sede, junto con el `globalStock`.

## wwwroot ->
### Base para la Pagina Web

## ConviTEC ->
### Web Builder
