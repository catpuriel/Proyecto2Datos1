//Estructura jerárquica de árbol AVL
// Para fines de este proyecto, se tomarán los últimos dos dígitos en el código de cada producto
// para realizar cálculos de inserción en el árbol AVL (Ej. de AA04, solo tomará el "04" y compara
// con los nodos del árbol)

using System;
using System.Globalization;
using ProyectoDatos2.Models;

/*
NO SE ESTA USANDO ESTE ARCHIVO PORQUE ConviTEC.Graphs.csproj LO ESTA IGNORANDO,
CUANDO NO DE ERROR DE COMPILACION, POR FAVOR ELIMINAR LA LINEA:
<Compile Remove="Structures\ArbolAVL.cs" />
DEL ARCHIVO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

namespace ProyectoDatos2.Structures
{
    public class NodoAVL
    {
        public Producto producto;
        public NodoAVL? left;
        public NodoAVL? right;
        public int altura;

        public NodoAVL(Producto producto, NodoAVL? left = null, NodoAVL? right = null)
        {
            this.producto = producto;
            this.left = left;
            this.right = right;
            this.altura = 0;
        }
    }

    public class ArbolAVL
    {
        private const int DesbalancePermitido = 1;
        private NodoAVL? raiz;

        public void Insertar(Producto valor)
        {
            raiz = Insertar(valor, raiz);
        }

        //---Metodos privados---

        // Metodo para obtener últimos 2 dígitos del código
        private int ObtenerClave(string codigo)
        {
            return int.Parse(codigo.Substring(codigo.Length - 2));
        }

        // Metodo para calcular la altura, retorna -1 si el nodo es null
        private int Altura(NodoAVL? n)
        {
            return n is null ? -1 : n.altura;
        }

        // Metodo de inserción privada. Usa recursividad
        private NodoAVL Insertar(Producto valor, NodoAVL? n)
        {
            if (n == null)
            {
                return new NodoAVL(valor);
            }

            if (ObtenerClave(valor.Codigo) < ObtenerClave(n.producto.Codigo))
            {
                n.left = Insertar(valor, n.left);
            }
            else if (ObtenerClave(valor.Codigo) > ObtenerClave(n.producto.Codigo))
            {
                n.right = Insertar(valor, n.right);
            }
            return Balance(n);
        }

        // Metodo de rebalance del arbol
        private NodoAVL? Balance(NodoAVL? n)
        {
            if (n is null)
            {
                return n;
            }

            if (Altura(n.left) - Altura(n.right) > DesbalancePermitido)
            {
                if (Altura(n.left!.left) >= Altura(n.left.right))
                {
                    n = RotacionLL(n);
                }
                else
                {
                    n = RotacionLR(n);
                }
            }
            else if (Altura(n.right) - Altura(n.left) > DesbalancePermitido)
            {
                if (Altura(n.right!.right) >= Altura(n.right.left))
                {
                    n = RotacionRR(n);
                }
                else
                {
                    n = RotacionRL(n);
                }
            }

            n.altura = Math.Max(Altura(n.left), Altura(n.right)) + 1;
            return n;
        }

        //-Metodos de rotacion-

        private NodoAVL RotacionLL(NodoAVL k2)
        {
            NodoAVL k1 = k2.left!;
            k2.left = k1.right;
            k1.right = k2;

            k2.altura = Math.Max(Altura(k2.left), Altura(k2.right)) + 1;
            k1.altura = Math.Max(Altura(k1.left), k2.altura) + 1;

            return k1;
        }
        private NodoAVL RotacionRR(NodoAVL k1)
        {
            NodoAVL k2 = k1.right!;
            k1.right = k2.left;
            k2.left = k1;

            k1.altura = Math.Max(Altura(k1.left), Altura(k1.right)) + 1;
            k2.altura = Math.Max(Altura(k2.right), k1.altura) + 1;

            return k2;
        }
        private NodoAVL RotacionLR(NodoAVL k3)
        {
            k3.left = RotacionRR(k3.left!);
            return RotacionLL(k3);
        }
        private NodoAVL RotacionRL(NodoAVL k1)
        {
            k1.right = RotacionLL(k1.right!);
            return RotacionRR(k1);
        }
    }
}

