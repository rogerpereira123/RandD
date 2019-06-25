using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.LinkedList
{
    public class SinglyLinkedList
    {
        SinglyLinkedListNode<string> S;
        public SinglyLinkedList(int n)
        {
            Init(n);
        }
        void Init(int n)
        {
            S = new SinglyLinkedListNode<string>() { Data = "N1" };
            var cur = S;
            for (int i = 1; i < n; i++)
            {
                cur.Next = new SinglyLinkedListNode<string>() { Data = "N" + (i + 1) };
                cur = cur.Next;
            }

        }
        public override string ToString()
        {
            if(S == null) return string.Empty;
            var cur = S;
            StringBuilder result = new StringBuilder(cur.Data + " -> ");
            while (cur.Next != null)
            {
                result.Append(cur.Next.Data + " -> ");
                cur = cur.Next;
            }
            result.Append("NULL");
            return result.ToString();
        }
        public void Delete(int i)
        {
            SinglyLinkedListNode<string> prevNode = null;
            SinglyLinkedListNode<string> nodeToDelete = S;
            var nextNode = nodeToDelete.Next;
            for(int j = 2; j <= i; j++)
            {
                prevNode = nodeToDelete;
                nodeToDelete = nodeToDelete.Next;
                nextNode = nodeToDelete.Next;
            }
            if (prevNode == null)
                S = nextNode;
            else prevNode.Next = nextNode;

            nodeToDelete = null;

        }


    }
}
