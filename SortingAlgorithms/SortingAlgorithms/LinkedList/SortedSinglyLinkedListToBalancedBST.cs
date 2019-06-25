using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SortingAlgorithms.LinkedList
{
    public class TreeNode<T> : Node<T>
    {
        public TreeNode<T> Right { get; set; }
        public TreeNode<T> Left { get; set; }

    }
    public class SortedSinglyLinkedListToBalancedBST
    {
        
         LinkedListNode<int> h;

        public SortedSinglyLinkedListToBalancedBST(LinkedListNode<int> head)
        {
            h = head;
        }
 
        public TreeNode<int> Convert(int start, int end)
        {
            TreeNode<int> curNode = null;
            if (start > end) return curNode;
            int m = (start + end) / 2;
            
            var left = Convert(start , m-1);
            var root = new TreeNode<int>(){Data = h.Value};
            h = h.Next;
          
            var right = Convert(m+1, end);

            root.Left = left;
            root.Right = right;
            return root;

        }
       
    }
}
