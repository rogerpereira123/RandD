using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Graphs
{
    //Longest Path from any node in graph
    public class LongestPathInGraph
    {
        static Dictionary<int, Node> input = new Dictionary<int, Node>();

        static Dictionary<Node, int> visited = new Dictionary<Node, int>();
        static int maxLevel = 0;
        static Node farthestNode;
        public struct Node
        {
            public int Value { get; set; }
            public List<Node> Children { get; set; }

           
        }
        public static void DFS(Node n, int d)
        {


            visited.Add(n, d);
            d++;
            
            
            foreach (var c in n.Children)
                if (!visited.ContainsKey(c))
                {
                    if (d > maxLevel)
                    {
                        maxLevel = d;
                        farthestNode = c;
                    }
                    DFS(c, d);
                }

        }
        public static int LongestPath(Node n)
        {
            DFS(n, 0);
            

            visited.Clear();
            maxLevel = 0;
            DFS(farthestNode, 0);
            
            //Console.WriteLine("From " + farthestNode.Value + " to " + distance.Where(i => i.Value == distance.Values.Max()).ElementAt(0).Key.Value);
            return maxLevel;
        }

        public static void Driver()
        {
            var n = Convert.ToInt32(Console.ReadLine());
            if (n > 1)
            {
                n--;
                while (n-- > 0)
                {
                    var splits = Console.ReadLine().Split(new char[1] { ' ' }, StringSplitOptions.None);
                    Node n1;
                    if (input.ContainsKey(Convert.ToInt32(splits[0])))
                        n1 = input[Convert.ToInt32(splits[0])];
                    else
                    {
                        n1 = new Node() { Value = Convert.ToInt32(splits[0]) , Children = new List<Node>() };
                        input.Add(Convert.ToInt32(splits[0]), n1);
                    }
                    Node n2;
                    if (input.ContainsKey(Convert.ToInt32(splits[1])))
                        n2 = input[Convert.ToInt32(splits[1])];
                    else
                    {
                        n2 = new Node() { Value = Convert.ToInt32(splits[1]), Children = new List<Node>() };
                        input.Add(Convert.ToInt32(splits[1]), n2);
                    }
                    n1.Children.Add(n2);
                    n2.Children.Add(n1);
                }
                Console.WriteLine(LongestPath(input.ElementAt(0).Value));
            }
            


            //Console.Read();
        }
    }
}
