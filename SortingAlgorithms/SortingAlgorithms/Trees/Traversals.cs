using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SortingAlgorithms.LinkedList;

namespace SortingAlgorithms.Trees
{
    /**
     * 
     *  TreeNode<string> n = new TreeNode<string>() { Data = "a" };
            n.Right = new TreeNode<string>() { Data = "b" };
            n.Left = new TreeNode<string>() { Data = "c" };
            n.Right.Right = new TreeNode<string>() { Data = "d" };
            n.Right.Left = new TreeNode<string>() { Data = "e" };
            n.Right.Right.Right = new TreeNode<string>() { Data = "f" };
            n.Right.Right.Left = new TreeNode<string>() { Data = "g" };
            n.Left.Right = new TreeNode<string>() { Data = "z" };
            Traversals.InOrder (n);
            Console.WriteLine();
            Traversals.InOrder(n);
     
     */
    class Traversals
    {
        public static int Height(TreeNode<string> n)
        {
            if (n == null)
                return -1;
            else 
                return Math.Max(Height(n.Left), Height(n.Right)) + 1;
        }
        public static void PreOrder(TreeNode<string> node)
        {
            if (node == null) return;
            Console.Write(node.Data + " ");
            PreOrder(node.Left);
            PreOrder(node.Right);
        }
        public static void PreOrderNoRecursion(TreeNode<string> node)
        {
            if (node == null) return;
            Stack<TreeNode<string>> s = new Stack<TreeNode<string>>();
            s.Push(node);
            while(s.Count > 0)
            {
                var n = s.Pop();
                Console.Write(n.Data + " ");
                if (n.Right != null) s.Push(n.Right);
                if (n.Left != null) s.Push(n.Left);
            }
        }
        public static void InOrder(TreeNode<string> node)
        {
            if (node == null) return;
            InOrder(node.Left);
            Console.Write(node.Data + " ");
            InOrder(node.Right);
        }
        public static void InOrderNoRecursion(TreeNode<string> node)
        {
            if (node == null) return;
            Stack<TreeNode<string>> s = new Stack<TreeNode<string>>();
            s.Push(node);
            var current= node;
            while(s.Count > 0)
            {
                if(current.Left != null)
                {
                    s.Push(current.Left);
                    current = current.Left;
                }
                else
                {
                    var n = s.Pop();
                    Console.Write(n.Data + " ");
                    if(n.Right != null)
                    {
                        s.Push(n.Right);
                        current = n.Right;
                    }
                }
            }
        }

    }
}
