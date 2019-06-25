using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SortingAlgorithms.LinkedList;

namespace SortingAlgorithms
{
    public class QueueUsingLinkedList<T>
    {
        SinglyLinkedListNode<T> head;
        SinglyLinkedListNode<T> tail;

        public void Enqueue(T item)
        {
            if (head == null)
            {
                head = new SinglyLinkedListNode<T>() { Data = item };
                tail = head;
            }
            else
            {
                var newNode = new SinglyLinkedListNode<T>() { Data = item };
                tail.Next = newNode;
                tail = tail.Next;
            }
            Console.WriteLine("Enqueued: " + item.ToString());
        }
        public T Dequeue()
        {
            if (head == null) return default(T);
            var item = head.Data;
            if (head == tail) tail = tail.Next;
            head = head.Next;
            Console.WriteLine("Dequeued: " + item.ToString());
            return item;
        }
    }
    public class QueueUsingLinkedList
    {
        public static void Driver()
        {
            QueueUsingLinkedList<int> q = new QueueUsingLinkedList<int>();
            q.Enqueue(1);
            q.Dequeue();
            q.Enqueue(1);
            q.Enqueue(2);
            q.Enqueue(3);
            q.Dequeue();
            q.Dequeue();
            q.Enqueue(4);
            q.Dequeue();
            q.Dequeue();
            q.Dequeue();

        }
    }
}
