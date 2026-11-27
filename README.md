# Proyecto 2 De Algoritmos y Estructuras de Datos I : ConviTEC | Rama: `feature/paso2-estructuras`

## Algorithms ->
### **Dijkstra.cs:**
El archivo con la clase `Dijkstra`, que tiene toda la informacion y funcionalidades para encontrar la ruta mas cercana como el algoritmo estipula. Si no tiene una ruta, es inalcanzable, considerado como `Infinity`, y se llama por medio de:
`Dijkstra.Run(Graph g, int source, out int[] dist, out int[] prev)`.
Los out daran unas variables ya listas con: 
- Los minutos minimos desde `source` hasta el lugar `i` (`dist[i]`) al final de la ejecucion de la funcion
- Desde que lugar se viene para llegar a `i` (`prev[i]`)

## ConviTEC ->
### Web Builder

## **Data -> rutas.json:**
Informacion de todas las rutas disponibles dadas por el profe, en un listado `.json` mas facil de acceder

## Models ->
### **ExistenciaSede.cs:**
Un `namespace` que representa la existencia de un producto en una sede

### **Producto.cs:**
Un `namespace` que representa un producto del catalogo

### **RutaGrafo.cs:**
Una clase meramente usada como modelo de datos. Representa una fila de la tabla de rutas del enunciado como `string id, string origen, string destino, int tiempo` (por ejemplo `R08, San José, Cartago, 45`) y no tiene logica, solo guarda esos datos.

## SeedsJSON ->
### Aqui se pueden encontrar los catalogos de cada sede, junto con el `globalStock`.

## Services ->
### RoutingService.cs
Toma un `Graph grafo` y un `string sede`, si no existe dice que no existe y termina. Si existe: pone la `UbicacionActualVehiculo` en la sede, el `TiempoAcumuladoMinutos` en 0, asigna su `grafo` y su `sede`, y su `HoraSalida` a las 11:00 a.m.

Antes de hacer una salida, debe chequear que sea a las 11am o las 3pm, y luego cambia su `HoraSalida`, su `UbicacionActualVehiculo` en la sede y el `TiempoAcumuladoMinutos` de vuelta a 0

Para revisar si un `string destino` es alcanzable desde un `string origen`, hace `Dijkstra.Run(...)` y si da `Infinity`, da `false`, si no, da `true`

Para `MoverA(...)` un lugar dado por `string destino`, el vehiculo debe sumar ese tiempo, ir a la nueva ubicacion y devolver `true` o devolver `false` si no pudo

## Structures ->
### **Graph.cs:**
El archivo con la clase `Graph` estructural para la creacion de los grafos utilizados en el proyecto. Tiene dos diferentes constructores:
- `Graph LoadFromJson(string path)`
- `Graph(int capacity = 2)`

Los grafos tienen varios metodos, como:
- `AddVertex(string name)`: Retorna el indice del vertice, si ya existia o lo crea y retorna su indice asignado
- `AddEdge(string a, string b, int minutes)`: Crea un camino entre dos vertices, con peso minutes, utiliza `AddVertex` para añadirlos en caso de que no existan y que no reviente, modifica la matriz del grafo para tomar en cuenta el nuevo tiempo entre esos dos vertices
- `resize()`: Se llama automaticamente si se llega a la capacidad maxima del grafo, crea una nueva lista y una nueva matriz del doble del tamaño para guardar todos los datos viejos ahi y los nuevos datos que entren

## wwwroot ->
### Base para la Pagina Web

## **Program.cs:**
Actualmente utilizado unicamente para pruebas relacionadas al algoritmo `Dijkstra` y las funcionalidades de los grafos.

## **ConviTEC.Graphs.csproj:**
El archivo .csproj que toma en consideracion las rutas de la carpeta Data para `LoadFromJson(route)` e ignora la carpeta ConviTEC para no tomar en cuenta el `.csproj` de esa carpeta
