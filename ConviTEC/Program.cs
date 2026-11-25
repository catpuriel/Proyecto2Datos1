var builder = WebApplication.CreateBuilder(args); //Prepara aplicación web en donde se estara el proyecto

string sede = ObtenerArgumento(args, "--sede"); //busca sede
string id = ObtenerArgumento(args, "--id"); //busca id
string puertoTexto = ObtenerArgumento(args, "--port"); // busca port

if (!int.TryParse(puertoTexto, out int puerto) || puerto is < 1 or > 65535) //Verifica que el puerto sea un número válido
{
    throw new ArgumentException("--port debe ser un puerto válido.");
}

builder.WebHost.UseUrls($"http://localhost:{puerto}");//Configura puerto y dirección

var app = builder.Build(); // Crea la aplicación
//Permiten servir archivos estaticos
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