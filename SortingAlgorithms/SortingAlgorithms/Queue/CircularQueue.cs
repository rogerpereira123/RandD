using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class CircularQueue<T>
    {
        T[] items;
        int head;
        int tail;
        int fillCount;
        public CircularQueue(int size)
        {
            items = new T[size];
            head = 0;
            tail = 0;
        }
        int Increment(int value)
        {
            return (value + 1) % items.Length;
        }
        public void Enqueue(T item)
        {
            if (fillCount < items.Length)
            {
                items[tail] = item;
                tail = Increment(tail);
                fillCount++;
            }
            else Console.WriteLine("Queue is full");
        }
        public T Dequeue()
        {
            T item = default(T);
            if (fillCount > 0)
            {
                item = items[head];
                items[head] = default(T);
                head = Increment(head);
                fillCount--;
            }
            else 
                Console.WriteLine("Queue is empty");
            return item;
        }
    }
}
