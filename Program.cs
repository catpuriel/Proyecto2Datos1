/*

                Hola se me habia olvidado decir que este archivo
                es meramente para pruebas, por ahora

                Aqui pueden encontrar algunas de las pruebas que he hecho
                para revisar resizing y el algoritmo de dijkstra,
                probablemente lo siga usando para otras pruebas hasta no tener
                un programa real finiquitado

*/

using ConviTEC.Models; //tengo que usarlo para sacar Pedido y DetallePedido

string ruta = Path.Combine(AppContext.BaseDirectory, "Data", "rutas.json");
Graph g = Graph.LoadFromJson(ruta);

Console.WriteLine("Lugares cargados: " + g.VertexCount);   // debería ser 16
Console.WriteLine();

Probar(g, "Liberia", "Cañas");      // 65 min
Probar(g, "Liberia", "Cartago");    // inalcanzable
Probar(g, "San José", "Limón");     // 180 min, por Turrialba
Probar(g, "San José", "Heredia");   // 20 min

RoutingService servicio = new RoutingService(g, "San José");
servicio.IniciarNuevaSalida(11);

Console.WriteLine();
Console.WriteLine("Liberia -> Cañas alcanzable: " + servicio.EsDestinoAlcanzable("Liberia", "Cañas"));     // True
Console.WriteLine("Liberia -> Cartago alcanzable: " + servicio.EsDestinoAlcanzable("Liberia", "Cartago")); // False

servicio.MoverA("Cartago");   // +45
servicio.MoverA("Paraíso");   // +15
Console.WriteLine("Ubicación: " + servicio.UbicacionActualVehiculo + ", tiempo: " + servicio.TiempoAcumuladoMinutos);
// Paraíso, 60

Console.WriteLine("Mover a Liberia: " + servicio.MoverA("Liberia"));   // False, y no cambia nada

// Función auxiliar: corre Dijkstra y muestra el resultado
static void Probar(Graph g, string origen, string destino)
{
    Dijkstra.Run(g, g.IndexOf(origen), out int[] dist, out int[] prev);
    int d = g.IndexOf(destino);

    if (dist[d] == Dijkstra.Infinity)
    {
        Console.WriteLine(origen + " -> " + destino + ": inalcanzable");
    }
    else
    {
        string camino = string.Join(" -> ", Dijkstra.GetPath(g, dist, prev, d));
        Console.WriteLine(origen + " -> " + destino + ": " + dist[d] + " min  (" + camino + ")");
    }
}

/*
        ----------------------------------------------------------
        Toda esta parte es nueva, y usa la implementacion de fabricio
        aqui son puras pruebas igual
        ----------------------------------------------------------
*/

//Lista de pedidos, usa cosas de ConviTEC de fabricio
Pedido[] pendientes =
{
    //Pedido simple, no tiene mucho mas que decir, solo Id y Destino
    new Pedido { Id = "P1", Destino = "Limón" },
    //Pedido mas elaborado con todo y sus detalles
    new Pedido 
    { 
        //Igual tiene Id y Destino
        Id = "P2", Destino = "Cartago",
        //pero ahora tiene detalles
        Detalles = new DetallePedido[]
        {
            //Si entendi bien como funciona detallepedido, necesita el codigo del producto,
            //la cantidad y el precio unitario
            new DetallePedido { CodigoProducto = "AA01", Cantidad = 2, PrecioUnitario = 1500m },
            new DetallePedido { CodigoProducto = "AA02", Cantidad = 1, PrecioUnitario = 800m }
        }
    },
    //Otros pedidos simples
    new Pedido { Id = "P3", Destino = "Paraíso" },
    new Pedido { Id = "P4", Destino = "Cartago" },
    new Pedido { Id = "P5", Destino = "Cañas" },      // inalcanzable desde San José
    new Pedido { Id = "P6", Destino = "Turrialba", Detalles = new DetallePedido[]
        {
            //Este pedido es por los memes, son 5 atunes tung, 3 lomitos de champivaca,
            //y 2 tomahawks tonyhawk (obviamente a TurriGOD)
            new DetallePedido { CodigoProducto = "AA12", Cantidad = 5, PrecioUnitario = 700m},
            new DetallePedido { CodigoProducto = "AA18", Cantidad = 3, PrecioUnitario = 5700m},
            new DetallePedido { CodigoProducto = "AA19", Cantidad = 2, PrecioUnitario = 8700m}
        }
    }
};

//Ahora si, esta parte prueba la nueva parte del RoutingService actualizado

//Primero lo crea
RoutingService salida = new RoutingService(g, "San José");
salida.IniciarNuevaSalida(11);

//Va a hacer un bucle hasta que entregue todos los que puede
while (true)
{
    //Calcula las siguientes entregas
    Pedido[] entregados = salida.CalcularSiguienteEntrega(pendientes);
    if (entregados.Length == 0) break; //Si ya no quedan entregados, acaba el bucle (caso base)

    string ids = ""; //Aqui se guardan los ids con la informacion del monto tambien
    for (int i = 0; i < entregados.Length; i++)
        //Agrega a los ids el id del entregado y saca el monto con la funcion de mas abajo
        ids += entregados[i].Id + " (" + Monto(entregados[i]) + " Colones) ";

    //Entrega en: donde haya quedado, pone los ids con su monto ya listo, tiempo acumulado: el tiempo acumulado y los minutos
    Console.WriteLine("Entrega en " + salida.UbicacionActualVehiculo + ": " + ids
                      + "| tiempo acumulado: " + salida.TiempoAcumuladoMinutos + " min");

    //Quita los entregados para pasar con el siguiente en la proxima iteracion
    pendientes = QuitarEntregados(pendientes, entregados);
}

//Pone la cantidad de pedidos que haya pendientes despues de lo anterior
//él nunca va a llegar a cañas desde san jose, asi que va a dar 1
Console.WriteLine("Sin entregar (inalcanzables): " + pendientes.Length);

//Cartago da P2 y P4 porque ambos tienen como destino Cartago.
//P2 da 3800 colones porque hay 2 unidades con precio 1500
//y una unidad con precio 800 (1500 * 2 + 800 = 3800)

//Turrialba da P6, precio 38000 colones por los 5 a(tung)es,
//los 3 lomitos y los 2 tonyhawks

/*
        ----------------------------------------------------------
        Estas son algunas funciones que voy a usar para esta prueba
        ----------------------------------------------------------
*/

// Suma cantidad * precio de cada detalle, si no tiene detalles, da 0
static decimal Monto(Pedido p)
{
    decimal total = 0;
    for (int i = 0; i < p.Detalles.Length; i++)
        total += p.Detalles[i].Cantidad * p.Detalles[i].PrecioUnitario;
    return total;
}

// Devuelve un arreglo nuevo con los pendientes que no están en "entregados"
static Pedido[] QuitarEntregados(Pedido[] pendientes, Pedido[] entregados)
{
    //Primero hay que ver cuantos van a quedar
    int restantes = 0;
    for (int i = 0; i < pendientes.Length; i++)
        if (!Contiene(entregados, pendientes[i])) restantes++;
    
    //Ahora hace un array de tamaño restantes (cuantos van a quedar)
    Pedido[] resultado = new Pedido[restantes];
    int k = 0;
    for (int i = 0; i < pendientes.Length; i++)
        if (!Contiene(entregados, pendientes[i])) resultado[k++] = pendientes[i];
    return resultado;
}

//Si contiene en el array de pedidos el pedido p, da true, si no, da false
static bool Contiene(Pedido[] arreglo, Pedido p)
{
    for (int i = 0; i < arreglo.Length; i++)
        if (arreglo[i] == p) return true;
    return false;
}