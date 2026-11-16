// Clase que representa un producto del catálogo

using System;

namespace ProyectoDatos2.Models
{
    public class Productos
    {
        public string Codigo;
        public string Nombre;
        public string Descripcion;
        public string Categoria;
        public double PrecioVenta;
        public int CantidadLocal;
        public ExistenciaSede[] StockGlobal;
    }
}