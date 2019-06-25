using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Trees
{
    class KthSmallestElementInBST
    {
        public class TreeNode
        {
            public int val;
            public TreeNode left;
            public TreeNode right;
            public TreeNode(int x) { val = x; }
        }
        int? InOrder(TreeNode n, ref int k)
        {
            if (n == null) return null;
            var result = InOrder(n.left, ref k);
            if (k == 0) return result;
            k--;
            if (k == 0) return n.val;
            result = InOrder(n.right, ref k);
            return result;


        }
        public int KthSmallest(TreeNode root, int k)
        {
            return (int)InOrder(root, ref k);
        }
    }
}
