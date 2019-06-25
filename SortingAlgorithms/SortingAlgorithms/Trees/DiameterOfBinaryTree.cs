using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Trees
{
   
    class DiameterOfBinaryTree
    {
        public class Node
        {
            public string Value { get; set; }
            public Node Left { get; set; }
            public Node Right { get; set; }

            public Node()
            {


            }
        }
        static Dictionary<string, Node> input = new Dictionary<string, Node>();
        

        static int Height(Node n)
        {
            if (n == null) return 0;

            return Math.Max(Height(n.Right), Height(n.Left)) + 1;
        }
        static int Diameter(Node n)
        {
            if (n == null) return 0;

            var lH = Height(n.Left);
            var rH = Height(n.Right);
            var ld = Diameter(n.Left);
            var rd = Diameter(n.Right);

            
            return Math.Max(lH + rH + 1, Math.Max(ld,rd));
        }
        public static void Driver()
        {
            
        }
    }
}
