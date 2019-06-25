using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Trees
{
    public class BinaryTreeNodeCount
    {
        /*
         * 
         * Steps to solve this problem:
1) get the height of left-most part
2) get the height of right-most part
3) when they are equal, the # of nodes = 2^h -1
4) when they are not equal, recursively get # of nodes from left&right sub-trees
         * 
         */
        public class TreeNode
        {
            public int val;
            public TreeNode left;
            public TreeNode right;
            public TreeNode(int x) { val = x; }
        }
        int LeftOnlyHeight(TreeNode n)
        {
            var t = n;
            int h = 0;
            while (t != null)
            {
                t = t.left;
                h++;
            }
            return h;
        }
        int RightOnlyHeight(TreeNode n)
        {
            var t = n;
            int h = 0;
            while (t != null)
            {
                t = t.right;
                h++;
            }
            return h;
        }
        public int CountNodes(TreeNode root)
        {
            if (root == null) return 0;
            var lh = LeftOnlyHeight(root);
            var rh = RightOnlyHeight(root);
            if (lh == rh) return Convert.ToInt32(Math.Pow(2, lh) - 1);
            else return 1 + CountNodes(root.left) + CountNodes(root.right);
        }
    }
}
