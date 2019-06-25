using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SortingAlgorithms.LinkedList;

namespace SortingAlgorithms
{
    public class BinaryTreeLCA
    {
        static List<string> InOrder(TreeNode<string> node)
        {
            if (node == null) return new List<string>();
            var result = new List<string>();
            result.AddRange(InOrder(node.Left));
            result.Add(node.Data);
            result.AddRange(InOrder(node.Right));
            return result;
        }
        static List<string> PostOrder(TreeNode<string> node)
        {
            if (node == null) return new List<string>();
            var result = new List<string>();
            result.AddRange(InOrder(node.Left));
            result.AddRange(InOrder(node.Right));
            result.Add(node.Data);
            return result;
        }
        public static string LCAWithTraversals(TreeNode<string> root, string s1, string s2)
        {
            if (root == null) return null;
            var inorder = InOrder(root);
            var postorder = PostOrder(root);
            var is1 = inorder.IndexOf(s1);
            var is2 = inorder.IndexOf(s2);
            var maxPostOrderIndex = 0;
            is1++;
            while (is1 < is2)
                if (postorder.IndexOf(inorder[is1]) > maxPostOrderIndex)
                    maxPostOrderIndex = postorder.IndexOf(inorder[is1]);
            return postorder[maxPostOrderIndex];
        }
        //Find path from root to s1 
        //Find path for root to s2
        //First common element in bottom up paths is the LCA
        public static string LCAWithoutTraversals(TreeNode<string> root, string s1 , string s2)
        {
            Stack<string> path1 = new Stack<string>();
            Stack<string> path2 = new Stack<string>();
            FindPath(root, path1 ,s1);
            FindPath(root, path2, s2);
            while (path1.Peek() != path2.Peek())
            {
                path1.Pop();
                path2.Pop();
            }
            return path1.Pop();
        }
        
        static bool FindPath(TreeNode<string> root , Stack<string> path, string s)
        {
            if (root == null) return false;
            path.Push(root.Data);
            if (root.Data == s)
                return true;
            bool checkInLeftSubtree = FindPath(root.Left,path, s);
            bool checkInRightSubtree = FindPath(root.Right,path, s);
            if (checkInLeftSubtree || checkInRightSubtree) return true;
            path.Pop();
            return false;
        }
    }
}
