using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SortingAlgorithms.LinkedList;

namespace SortingAlgorithms
{
    public class ReconstructBinaryTreeFromTraversals
    {
        public static TreeNode<string> Reconstruct(string[] preorder, string[] inorder, ref int preorderIndex , int iStartInorder, int iEndInorder)
        {
            if(iStartInorder > iEndInorder)
            {
                preorderIndex--;
                return null;
            }
            var data = preorder[preorderIndex];
            var n = new TreeNode<string>() { 
                Data = data
            };
            var i = Array.IndexOf(inorder, data);
            preorderIndex++;
            n.Left = Reconstruct(preorder, inorder, ref preorderIndex , iStartInorder, i - 1);
            preorderIndex++;
            n.Right = Reconstruct(preorder, inorder, ref preorderIndex , i + 1, iEndInorder);
            return n;
        }

        public static void Driver()
        {
            string[] inorder = new string[] {"D" , "B" , "E" , "A" , "F" , "C"  };
            string[] preorder = new string[] { "A", "B", "D", "E", "C", "F" };
            int i = 0;
            var root = Reconstruct(preorder, inorder,ref i, 0, inorder.Length - 1);

        }
    }
}
