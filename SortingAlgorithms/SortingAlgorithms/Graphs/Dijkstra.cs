using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SortingAlgorithms.MinimumSpanningTree;

namespace SortingAlgorithms.Graphs
{
    /*
     
      Vertex<string> a = new Vertex<string>() { Data = "a" };
            Vertex<string> b = new Vertex<string>() { Data = "b" };
            Vertex<string> c = new Vertex<string>() { Data = "c" };
            Vertex<string> d = new Vertex<string>() { Data = "d" };
            Vertex<string> e = new Vertex<string>() { Data = "e" };
            Vertex<string> f = new Vertex<string>() { Data = "f" };

            a.Edges.Add(new Edge<string>() { From = a, To = b, Weight = 7 });
            a.Edges.Add(new Edge<string>() { From = a, To = c, Weight = 9 });
            a.Edges.Add(new Edge<string>() { From = a, To = f, Weight = 14 });

            b.Edges.Add(new Edge<string>() { From = b, To = a, Weight = 7 });
            b.Edges.Add(new Edge<string>() { From = b, To = c, Weight = 10 });
            b.Edges.Add(new Edge<string>() { From = b, To = d, Weight = 15 });

            c.Edges.Add(new Edge<string>() { From = c, To = a, Weight = 9 });
            c.Edges.Add(new Edge<string>() { From = c, To = b, Weight = 10 });
            c.Edges.Add(new Edge<string>() { From = c, To = d, Weight = 11 });
            c.Edges.Add(new Edge<string>() { From = c, To = f, Weight = 2 });

            d.Edges.Add(new Edge<string>() { From = d, To = b, Weight = 15 });
            d.Edges.Add(new Edge<string>() { From = d, To = c, Weight = 11 });
            d.Edges.Add(new Edge<string>() { From = d, To = e, Weight = 6 });

            e.Edges.Add(new Edge<string>() { From = e, To = d, Weight = 6 });
            e.Edges.Add(new Edge<string>() { From = e, To = f, Weight = 9 });

            f.Edges.Add(new Edge<string>() { From = f, To = a, Weight = 14 });
            f.Edges.Add(new Edge<string>() { From = f, To = c, Weight = 2 });
            f.Edges.Add(new Edge<string>() { From = f, To = e, Weight = 9 });


            Dijkstra dj = new Dijkstra();
            dj.GetShortestPath(a , f);
     */
    //Runtime O(V**2 ) and if Min-Heap is used then O(E+VlogV)
    public class Dijkstra
    {
        public Dictionary<Vertex<string>, double> Dist = new Dictionary<Vertex<string>, double>();
        public Dictionary<Vertex<string>, Vertex<string>> Prev = new Dictionary<Vertex<string>, Vertex<string>>();
        
        Vertex<string> GetMinDist()
        {
            var unvisited = Dist.Where(t => t.Key.Visited == false).ToList();
            return unvisited.Where( v => v.Value == unvisited.Min(t => t.Value)).ElementAt(0).Key;
        }
        public List<Vertex<string>> GetShortestPath(Vertex<string> source , Vertex<string> target)
        {
            
            Compute(source);
            if (!Dist.ContainsKey(target)) return new List<Vertex<string>>();
            var result = new List<Vertex<string>>();
            Stack<Vertex<string>> s = new Stack<Vertex<string>>();
            s.Push(target);
            var v = target;
            while(Prev.ContainsKey(v))
            {
                s.Push(Prev[v]);
                v = Prev[v];
            }
            while (s.Count > 0)
                result.Add(s.Pop());
            return result;
            
            
        }
        void Compute(Vertex<string> source)
        {
            Dist.Add(source, 0);
            Prev.Add(source, null);
            Dictionary<Vertex<string> , bool> Unvisited = new Dictionary<Vertex<string>,bool>();
            Queue<Vertex<string>> q = new Queue<Vertex<string>>();
            q.Enqueue(source);
            Unvisited.Add(source,  false);
            while(q.Count > 0)
            {
                var n = q.Dequeue();
                foreach(var v in n.Neighbours)
                {
                    if(!Unvisited.ContainsKey(v))
                    {
                        Unvisited.Add(v , false);
                        q.Enqueue(v);
                    }
                }
            }

            while(Unvisited.Count > 0)
            {
                var u = GetMinDist();
                u.Visited = true;
                Unvisited.Remove(u);
                foreach(var e in u.Edges)
                {
                    var alt = Dist[u] + e.Weight;
                    if (Dist.ContainsKey(e.To))
                    {
                        if (alt < Dist[e.To])
                        {
                            Dist[e.To] = alt;
                            if (Prev.ContainsKey(e.To)) Prev[e.To] = u;
                            else Prev.Add(e.To, u);
                        }
                    }
                    else
                    {
                        Dist.Add(e.To, alt);
                        if (Prev.ContainsKey(e.To)) Prev[e.To] = u;
                        else Prev.Add(e.To, u);
                    }
                    

                }
            }
        }

    }
}
