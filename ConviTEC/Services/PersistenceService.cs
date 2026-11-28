using System.Text.Json;
namespace ConviTEC.Services;

public static class PersistenceService
{
    private static readonly JsonSerializerOptions OpcionesJson = new()
    {
        WriteIndented = true,
        PropertyNameCaseInsensitive = true
    };
    public static T[] Cargar<T>(string ruta)
    {
        // En una sede nueva todavía no hay archivo: empieza con cero registros.
        if (!File.Exists(ruta))
            return Array.Empty<T>();
        // Lee el archivo completo como texto.
        string json = File.ReadAllText(ruta);
        // Convierte el JSON a un arreglo del tipo solicitado.
        // Si el archivo está mal formado, el error se muestra; no lo reemplazamos silenciosamente.
        return JsonSerializer.Deserialize<T[]>(json, OpcionesJson)
            ?? throw new InvalidDataException($"El archivo JSON está vacío o no contiene datos válidos: {ruta}");
    }
    public static void Guardar<T>(string ruta, T[] datos)
    {
        // Crea la carpeta que contiene el archivo, si todavía no existe.
        string? carpeta = Path.GetDirectoryName(ruta);
        if (!string.IsNullOrEmpty(carpeta))
            Directory.CreateDirectory(carpeta);
        // Convierte el arreglo a JSON legible.
        string json = JsonSerializer.Serialize(datos, OpcionesJson);
        // Crea el archivo o sobrescribe su contenido anterior.
        File.WriteAllText(ruta, json);
    }
}