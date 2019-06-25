using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Trees
{
    /*Invert a binary tree.

     4
   /   \
  2     7
 / \   / \
1   3 6   9
to
     4
   /   \
  7     2
 / \   / \
9   6 3   1*/
    public class TreeNode {
      public int val;
      public TreeNode left;
      public TreeNode right;
      public TreeNode(int x) { val = x; }
  }
    public class InvertABinaryTree
    {
        public TreeNode InvertTree(TreeNode root)
        {
            if (root == null) return null;
            if (root.left != null && root.right != null)
            {
                var t = root.left;
                root.left = root.right;
                root.right = t;
            }
            else if (root.left != null && root.right == null)
            {
                root.right = new TreeNode(root.left.val);
                root.right.left = root.left.left;
                root.right.right = root.left.right;
                root.left = null;

            }
            else if (root.right != null && root.left == null)
            {
                root.left = new TreeNode(root.right.val);
                root.left.left = root.right.left;
                root.left.right = root.right.right;
                root.right = null;

            }
            InvertTree(root.left);
            InvertTree(root.right);
            return root;

        }
    }
}
