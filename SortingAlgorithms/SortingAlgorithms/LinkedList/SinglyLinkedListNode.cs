using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.LinkedList
{
    public class SinglyLinkedListNode<T>: Node<T>
    {
        public SinglyLinkedListNode<T> Next { get; set; }
    }
    
}
