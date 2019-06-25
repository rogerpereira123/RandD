using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Graphs.Traversal
{
    /**
     *  Vertex<string> a = new Vertex<string>() { Data = "a" };
            Vertex<string> b = new Vertex<string>() { Data = "b" };
            Vertex<string> d = new Vertex<string>() { Data = "d" };
            Vertex<string> e = new Vertex<string>() { Data = "e" };
            Vertex<string> c = new Vertex<string>() { Data = "c" };
            Vertex<string> f = new Vertex<string>() { Data = "f" };
                       
            a.Neighbors.AddRange(new List<Vertex<string>>() { d, b });
            d.Neighbors.AddRange(new List<Vertex<string>>() { b });
            b.Neighbors.AddRange(new List<Vertex<string>>() { e });
            e.Neighbors.AddRange(new List<Vertex<string>>() { d });
            c.Neighbors.AddRange(new List<Vertex<string>>() { e, f });
            f.Neighbors.AddRange(new List<Vertex<string>>() {   });
            var dfs = new DepthFirstSearch<string>();



            Console.WriteLine("DFS:***********");
            dfs.DFS(new Vertex<string>[] { a,c });
            Console.WriteLine("Is there a cycle: " + dfs.IsThereACycle);
            Console.WriteLine("End DFS:***********");
   */
    public enum TypeOfGraph
    {
        Directed,
        Undirected
    }
    public class DepthFirstSearch<T>
    {
        //VisitedNode - Parent Dictionary
        Dictionary<Vertex<T>, Vertex<T>> Visited;
        public bool IsThereACycle { get; set; }
        Dictionary<Vertex<T>, bool> CycleChecker { get; set; }
        public TypeOfGraph GraphType { get; set; }
        public DepthFirstSearch(TypeOfGraph typeOfGrpah)
        {
            IsThereACycle = false;
            Visited = new Dictionary<Vertex<T>, Vertex<T>>();
            CycleChecker = new Dictionary<Vertex<T>, bool>();
            GraphType = typeOfGrpah;
        }
        public void DFS(Vertex<T>[] v)
        {
            foreach (var n in v)
            {
                if (Visited.ContainsKey(n)) continue;
                else
                {
                    Visited.Add(n, null);
                    DFS_VISIT(n);
                }
            }
        }
        void DFS_VISIT(Vertex<T> v)
        {
            CycleChecker.Add(v, true);
            Console.WriteLine("Node visited : " + v.Data.ToString());
            foreach(var n in v.Neighbors)
            {
                //
                if (GraphType == TypeOfGraph.Directed && CycleChecker.ContainsKey(n) && CycleChecker[n]) IsThereACycle = true;
                if (Visited.ContainsKey(n))
                {
                    //This node is visited (n) and its not v's parent means there exist a cycle in undirected graph
                    if (GraphType == TypeOfGraph.Undirected && Visited[v] != n) IsThereACycle = true;
                    continue;
                }
                
                Visited.Add(n, v);
                DFS_VISIT(n);
            }
            CycleChecker[v] = false;
        }
        public void DFSWithStack(Vertex<T>[] V)
        {
            Stack<Vertex<T>> s = new Stack<Vertex<T>>();
            foreach (var v in V)
            {
                s.Push(v);
                

            }
            while(s.Count > 0)
            {
                var v = s.Pop();
               
                if (!Visited.ContainsKey(v))
                {
                    
                    Console.WriteLine("Node visited : " + v.Data.ToString());
                    Visited.Add(v, null);
                    foreach (var n in v.Neighbors)
                    {
                       
                        s.Push(n);
                        
                        
                    }
                   
                }

                
            }
        }
    }
}
