// Clase que representa un producto del catálogo

using System;

namespace ProyectoDatos2.Models
{
    public class Producto
    {
        public string Codigo { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Categoria { get; set; }
        public double PrecioVenta { get; set; }
        public int CantidadLocal { get; set; }
        public ExistenciaSede[] StockGlobal { get; set; }
    }
}