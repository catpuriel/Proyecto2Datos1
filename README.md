# Proyecto 2 De Algoritmos y Estructuras de Datos I : ConviTEC | Rama: `feature/paso3-logica-local`

## Algorithms ->
### **Dijkstra.cs:**
El archivo con la clase `Dijkstra`, que tiene toda la informacion y funcionalidades para encontrar la ruta mas cercana como el algoritmo estipula. Si no tiene una ruta, es inalcanzable, considerado como `Infinity`, y se llama por medio de:
`Dijkstra.Run(Graph g, int source, out int[] dist, out int[] prev)`.
Los out daran unas variables ya listas con: 
- Los minutos minimos desde `source` hasta el lugar `i` (`dist[i]`) al final de la ejecucion de la funcion
- Desde que lugar se viene para llegar a `i` (`prev[i]`)

## ConviTEC ->
### Web Builder, aunque hay cosas que si se utilizan y soy capaz de explicar, por ahora:

## ConviTEC -> Models ->
### **DetallesPedido.cs**
Guarda los detalles de un pedido, como el `CodigoProducto`, `Cantidad`, `PrecioUnitario`, todos son getters y setters

### **Pedidos.cs**
Tiene la clase `Pedido`, con puros getters y setters. Ahorita se usa mas que todo el `Id`, `Destino`, y `DetallePedido[] Detalles`
- `Id` guarda la ID unica del `Pedido`
- `Destino` guarda el nombre del destino al que quiere llegar
- `Detalles` guarda los detalles del pedido en un array de `DetallePedido[]`

### Los demas aun no los utilizo (yo *Evan*), asi que espero una explicacion de *Fabricio*

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
### **RoutingService.cs**
Toma un `Graph grafo` y un `string sede`, si no existe dice que no existe y termina. Si existe: pone la `UbicacionActualVehiculo` en la sede, el `TiempoAcumuladoMinutos` en 0, asigna su `grafo` y su `sede`, y su `HoraSalida` a las 11:00 a.m.

Ahora tambien toma en cuenta `Pedido` de *Fabricio*, asi que tiene `CalcularSiguienteEntrega`, que, de la lista de pedidos, saca el mas cercano y entrega todo lo que haya pendiente ahi, retorna los `entregados` como un array de `Pedido[]`

Antes de hacer una salida, debe chequear que sea a las 11am o las 3pm, y luego cambia su `HoraSalida`, su `UbicacionActualVehiculo` en la sede y el `TiempoAcumuladoMinutos` de vuelta a 0

Para revisar si un `string destino` es alcanzable desde un `string origen`, hace `Dijkstra.Run(...)` y si da `Infinity`, da `false`, si no, da `true`

Para `MoverA(...)` un lugar dado por `string destino`, el vehiculo debe sumar ese tiempo, ir a la nueva ubicacion y devolver `true` o devolver `false` si no pudo

## Structures ->
### **ArbolAVL.cs:**
El archivo encargado de la realizacion de un ArbolAVL para organizacion de productos. Tiene opciones para insercion, rotaciones `RR, LL, RL, LR`, da el `balance` de los nodos y la `altura`. Ahorita mismo no compila adecuadamente, asi que se ignora temporalmente por el .csproj hasta una resolucion de problemas

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
Actualmente utilizado unicamente para pruebas relacionadas al algoritmo `Dijkstra`, las funcionalidades de los grafos y el calculo de los siguientes pedidos

## **ConviTEC.Graphs.csproj:**
El archivo .csproj que toma en consideracion las rutas de la carpeta Data para `LoadFromJson(route)` e ignora la carpeta ConviTEC para no tomar en cuenta el `.csproj` de esa carpeta, excepto que si toma en cuenta los `Models` `DetallesPedido.cs` y `Pedidos.cs`. Ignora temporalmente la estructura de `ArbolAVL.cs`, porque no se utiliza y da problemas de compilacion en la ultima prueba.
