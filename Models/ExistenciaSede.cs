//Clase que representa la existencia de un producto en una sede

namespace ProyectoDatos2.Models
{
    public class ExistenciaSede //se pusieron el get y set para que las variaboles agaren los datos
    {
        public string IdSede {get; set;} = string.Empty;
        public string Producto {get; set;} = string.Empty;
        public int Cantidad {get; set;}
    }
}