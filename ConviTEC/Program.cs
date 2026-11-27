using ConviTEC.Models;
using ConviTEC.Services;
using ConviTEC.Structures;
using ProyectoDatos2.Models;

var builder = WebApplication.CreateBuilder(args); //Prepara aplicación web en donde se estara el proyecto

string sede = ObtenerArgumento(args, "--sede"); //busca sede
string id = ObtenerArgumento(args, "--id"); //busca id
string puertoTexto = ObtenerArgumento(args, "--port"); // busca port

if (!int.TryParse(puertoTexto, out int puerto) || puerto is < 1 or > 65535) //Verifica que el puerto sea un número válido
{
    throw new ArgumentException("--port debe ser un puerto válido.");
}

builder.WebHost.UseUrls($"http://localhost:{puerto}");//Configura puerto y dirección

string carpetaDatos = Path.Combine(
    builder.Environment.ContentRootPath,
    "Data",
    id
);

ExistenciaSede[] inventario = PersistenceService.Cargar<ExistenciaSede>(
    Path.Combine(carpetaDatos, "Inventario.json")
);
Pedido[] pedidos = PersistenceService.Cargar<Pedido>(
    Path.Combine(carpetaDatos, "Pedidos.json")
);
Venta[] ventas = PersistenceService.Cargar<Venta>(
    Path.Combine(carpetaDatos, "ventas.json")
);

var app = builder.Build(); // Crea la aplicación
//Permiten servir archivos estaticos
app.MapGet("/api/pedidos", () => pedidos);
app.MapGet("/api/ventas", () => ventas);
app.MapGet("/api/inventario/local", () => inventario);
app.MapPost("/api/pedidos", (Pedido nuevoPedido) =>
{
    if (string.IsNullOrWhiteSpace(nuevoPedido.Id))
        return Results.BadRequest("El pedido debe tener un identificador.");

    foreach (Pedido pedido in pedidos)
    {
        if (pedido.Id == nuevoPedido.Id)
            return Results.Conflict("Ya existe un pedido con ese identificador.");
    }

    pedidos = Agregar(pedidos, nuevoPedido);
    PersistenceService.Guardar(Path.Combine(carpetaDatos, "Pedidos.json"), pedidos);
    return Results.Ok(nuevoPedido);
});
app.MapPost("/api/ventas", (Venta nuevaVenta) =>
{
    if (string.IsNullOrWhiteSpace(nuevaVenta.Id))
        return Results.BadRequest("La venta debe tener un identificador.");

    foreach (Venta venta in ventas)
    {
        if (venta.Id == nuevaVenta.Id)
            return Results.Conflict("Ya existe una venta con ese identificador.");
    }

    ventas = Agregar(ventas, nuevaVenta);
    PersistenceService.Guardar(Path.Combine(carpetaDatos, "ventas.json"), ventas);
    return Results.Ok(nuevaVenta);
});
app.MapPost("/api/inventario/local", (ExistenciaSede existencia) =>
{
    if (!string.Equals(existencia.IdSede, id, StringComparison.OrdinalIgnoreCase))
        return Results.BadRequest("La existencia debe pertenecer a esta sede.");
    if (string.IsNullOrWhiteSpace(existencia.Producto) || existencia.Cantidad < 0)
        return Results.BadRequest("El producto debe tener código y la cantidad no puede ser negativa.");

    for (int i = 0; i < inventario.Length; i++)
    {
        if (inventario[i].Producto == existencia.Producto)
        {
            inventario[i] = existencia;
            PersistenceService.Guardar(Path.Combine(carpetaDatos, "Inventario.json"), inventario);
            return Results.Ok(existencia);
        }
    }

    inventario = Agregar(inventario, existencia);
    PersistenceService.Guardar(Path.Combine(carpetaDatos, "Inventario.json"), inventario);
    return Results.Ok(existencia);
});
app.UseDefaultFiles(); 
app.UseStaticFiles(); 

app.MapGet("/", () => "ConviTEC API funcionando"); //Define rutas HTPP, devuelve / como prueba
app.MapGet("/api/sede/info", () => new { sede, id, puerto }); //Devuelve datos del JSON de la sede

app.Run();

static string ObtenerArgumento(string[] argumentos, string nombre) //Función auxiliar para ver errores  
{
    int posicion = Array.IndexOf(argumentos, nombre);
    if (posicion < 0 || posicion + 1 >= argumentos.Length)
    {
        throw new ArgumentException($"Falta el argumento {nombre}.");
    }
    return argumentos[posicion + 1];
}

static T[] Agregar<T>(T[] elementos, T elemento)
{
    var arreglo = new ArregloDinamico<T>();
    foreach (T existente in elementos)
        arreglo.Agregar(existente);

    arreglo.Agregar(elemento);
    return arreglo.AArreglo();
}
