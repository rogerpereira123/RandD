using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SortingAlgorithms.LinkedList;

namespace SortingAlgorithms
{
    //Keep on updating head of linked list with newer elements.
    public class StackUsingLinkedList<T>
    {
        SinglyLinkedListNode<T> top;
        
        public StackUsingLinkedList()
        {

        }
        public void Push(T item)
        {
            if (top == null) top = new SinglyLinkedListNode<T>() { Data = item };
            var newNode = new SinglyLinkedListNode<T>()
            {
                Data = item
            };
            newNode.Next = top;
            top = newNode;
            Console.WriteLine("Pushed: " + item.ToString());
        }
        public T Pop()
        {
            if (top == null) return default(T);
            var result = top.Data;
            top = top.Next;
            Console.WriteLine("Popped: " + result.ToString());
            return result;
        }
    }
   
    public class StackUsingLinkedList
    {
        public static void Driver()
        {
            StackUsingLinkedList<int> s = new StackUsingLinkedList<int>();
            s.Push(5);
            s.Push(4);
            s.Push(3);
            s.Pop();
            s.Pop();
            s.Push(100);
            s.Push(200);
            s.Pop();
            
        }
    }
   
    
}
