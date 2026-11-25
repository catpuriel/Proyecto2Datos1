namespace ConviTEC.Structures;

public class ColaPropia<T>
{
    private T[] elementos = new T[4];
    private int cantidad;
    public bool EstaVacia => cantidad == 0;
    public void Encolar(T elemento)
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

    public T Desencolar()
    {
        if (EstaVacia)
            throw new InvalidOperationException("No se puede desencolar una cola vacía.");
        T primero = elementos[0];
        for (int i = 0; i < cantidad - 1; i++)
            elementos[i] = elementos[i + 1];
        cantidad--;
        elementos[cantidad] = default!;
        return primero;
    }
    public T[] AArreglo()
    {
        T[] copia = new T[cantidad];
        Array.Copy(elementos, copia, cantidad);
        return copia;
    }
}