using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace SortingAlgorithms.Graphs.Traversal
{
    /*
    * Vertex<string> s = new Vertex<string>() { Data = "s" };
           Vertex<string> a = new Vertex<string>() { Data = "a" };
           Vertex<string> z = new Vertex<string>() { Data = "z" };
           Vertex<string> x = new Vertex<string>() { Data = "x" };
           Vertex<string> d = new Vertex<string>() { Data = "d" };
           Vertex<string> c = new Vertex<string>() { Data = "c" };
           Vertex<string> f = new Vertex<string>() { Data = "f" };
           Vertex<string> v = new Vertex<string>() { Data = "v" };
           s.Neighbors.AddRange(new List<Vertex<string>>(){ a,x });
           a.Neighbors.AddRange(new List<Vertex<string>>() { z, s });
           z.Neighbors.AddRange(new List<Vertex<string>>() { a });
           x.Neighbors.AddRange(new List<Vertex<string>>() {s, c, d });
           c.Neighbors.AddRange(new List<Vertex<string>>() {  x,d ,v});
           d.Neighbors.AddRange(new List<Vertex<string>>() {x , c , f });
           f.Neighbors.AddRange(new List<Vertex<string>>() { d });
           v.Neighbors.AddRange(new List<Vertex<string>>() { c });
           var bfs = new BreadthFirstSearch();
           Console.WriteLine("BFS:***********");
           bfs.BFS<string>(s);
           Console.WriteLine("End BFS:***********");
    * 
    * */
    public class Vertex<T>
    {
        public T Data { get; set; }
        public List<Vertex<T>> Neighbors { get; set; }
        public Vertex()
        {
            Neighbors = new List<Vertex<T>>();
        }
    }
    public class BreadthFirstSearch
    {
        public void BFS<T>(Vertex<T> v)
        {
            Queue<Vertex<T>> queue = new Queue<Vertex<T>>();
            Dictionary<Vertex<T>, int> visited = new Dictionary<Vertex<T>, int>();
            int level = 0;
            queue.Enqueue(v);
            visited.Add(v, 0);
            while(queue.Count > 0)
            {
                var current = queue.Dequeue();
                level = visited[current];
                Console.WriteLine("Level: " + level + " - " + current.Data.ToString());
                level++;
                foreach(var c in current.Neighbors)
                {
                    if (visited.ContainsKey(c)) continue;
                    queue.Enqueue(c);
                    visited.Add(c, level);
                }
            }
        }

        public void BFSNoQueue<T>(Vertex<T> v)
        {
            if (v == null) return;
            List<Vertex<T>> frontier = new List<Vertex<T>>();
            List<Vertex<T>> next = new List<Vertex<T>>();
            Dictionary<Vertex<T>, int> Visited = new Dictionary<Vertex<T>, int>();
            frontier.Add(v);
            Visited.Add(v , 0);
            int level = -1;
            while(frontier.Count > 0)
            {
                next.Clear();
                level++;
                for(var i = 0 ; i < frontier.Count; i++)
                {
                    var current = frontier[i];
                    Console.WriteLine("Level: " + level + " -  " + current.Data.ToString());
                    
                    foreach (var n in current.Neighbors)
                    {
                        if (Visited.ContainsKey(n)) continue;
                        next.Add(n);
                        Visited.Add(n, level);
                    }
                       
                }
                frontier.Clear();
                frontier.AddRange(next);
                
            }
        }
    }
}
