using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.MinimumSpanningTree
{
    public class Edge<T> : IComparable<Edge<T>>
    {
        public Vertex<T> From { get; set; }
        public Vertex<T> To { get; set; }
        public int Weight { get; set; }



        public int CompareTo(Edge<T> other)
        {
            if (Weight == other.Weight) return 0;
            else if (Weight < other.Weight) return -1;
            else return 1;
        }
    }
    public class Vertex<T>
    {
        public bool Visited { get; set; }
        public T Data { get; set; }
        public List<Edge<T>> Edges { get; set; }
        public List<Vertex<T>> Neighbours
        {
            get
            {
                return Edges.Select(t => t.To).ToList();

            }
        }
        public Vertex()
        {
            Edges = new List<Edge<T>>();
            Visited = false;
        }
    }
    public class MinSpanningTree<T>
    {
        PriorityQueue<Edge<T>> pqueue = new PriorityQueue<Edge<T>>();
        public MinSpanningTree()
        {

        }

        void BFS(Vertex<T> node)
        {
            if (node == null) return;
            Dictionary<Vertex<T>, int> visited = new Dictionary<Vertex<T>, int>();
            Queue<Vertex<T>> q = new Queue<Vertex<T>>();
            Dictionary<Vertex<T>, Vertex<T>> visitedEdges = new Dictionary<Vertex<T>, Vertex<T>>();
                
            q.Enqueue(node);
            visited.Add(node, 0);
            while(q.Count > 0)
            {
                var n = q.Dequeue();
                foreach (var e in n.Edges)
                {
                    if (visitedEdges.ContainsKey(e.To) && visitedEdges[e.To] == n) continue;
                    pqueue.Enqueue(e);
                }
                int level = visited[n];
                level++;
                foreach (var neighbour in n.Neighbours)
                {
                    if (visited.ContainsKey(neighbour)) continue;
                    else
                    {
                        visited.Add(neighbour, level);
                        q.Enqueue(neighbour);
                    }
                }
            }

        }

    }
}
