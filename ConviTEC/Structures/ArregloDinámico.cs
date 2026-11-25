namespace ConviTEC.Structures;

public class ArregloDinamico<T>
{
    private T[] elementos = new T[4];
    private int cantidad;
    public int Cantidad => cantidad;
    public void Agregar(T elemento)
    {
        if (cantidad == elementos.Length)
        {
            T[] nuevo = new T[elementos.Length * 2];
            Array.Copy(elementos, nuevo, cantidad);
            elementos = nuevo;
        }
        elementos[cantidad] = elemento;
        cantidad++;
    }
    public T Obtener(int indice)
    {
        if (indice < 0 || indice >= cantidad)
            throw new ArgumentOutOfRangeException(nameof(indice));

        return elementos[indice];
    }
    public void Eliminar(int indice)
    {
        if (indice < 0 || indice >= cantidad)
            throw new ArgumentOutOfRangeException(nameof(indice));
        for (int i = indice; i < cantidad - 1; i++)
            elementos[i] = elementos[i + 1];
        cantidad--;
        elementos[cantidad] = default!;
    }
    public T[] AArreglo()
    {
        T[] copia = new T[cantidad];
        Array.Copy(elementos, copia, cantidad);
        return copia;
    }
}