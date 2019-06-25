using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SortingAlgorithms.LinkedList;

namespace SortingAlgorithms
{
    public class BSTLCA
    {
        public static int? FindLCA(TreeNode<int> root, int n1 ,int n2)
        {
            if (root == null) return null;
            if (root.Data > n1 && root.Data > n2)
                return FindLCA(root.Left, n1, n2);
            else if (root.Data < n1 && root.Data < n2)
                return FindLCA(root.Right, n1, n2);
            return root.Data;
        }
    }
}
