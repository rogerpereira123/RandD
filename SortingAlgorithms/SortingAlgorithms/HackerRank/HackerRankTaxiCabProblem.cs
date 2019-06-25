using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.HackerRank
{
    /*
     Problem Statement

Burger Town is a city that consists of N special junctions and N−1 pathways. There is exactly one shortest path between each pair of junctions. Junction i is located at (xi,yi) and the distance between two junctions i,j is defined by the Taxicab geometry.

Tim has recently afforded a taxicab to work as a taxicab driver. His vehicle was very cheap, but has a very big flaw. It can only drive H units horizontally and V units vertically before refueling.

If a customer wants to be brought from a junction i to another junction j, then this car is only capable of driving the route, iff the sum of horizontal distances and the sum of vertical distances on this path are less than or equal to H and V respectively.

Also, there is a unique path between any two junctions.

Now he has thoughts about returning the vehicle back to the seller. But he first wants to know, if it's even worth it. That's why he wants to know the number of unordered pairs (i,j) such that it is not possible to drive a customer from junction i to junction j.

Input Format

On the first line you will be given N, H and V separated by a single space. 
Each of the next N lines contains two space separated integers xi,yi, denoting the location of junction i. Each of the next N−1 lines contains two space separated integers describing a path existing between ui,vi, i.e., there is a path between ui and vi.

Output Format

Output the number of unordered pairs (i,j) such that it is not possible to drive from i to j.
    */

    /*
     * 
      var input = "";
            using (var fs = File.Open(@"C:\Users\temp\Google Drive\input02.txt", FileMode.Open))
            {
                using (StreamReader sr = new StreamReader(fs))
                {
                    input = sr.ReadToEnd();
                }

            }
            var inputArray = input.Split(new string[] { "\n" }, StringSplitOptions.RemoveEmptyEntries);
            HackerRankTaxiCabProblem p = new HackerRankTaxiCabProblem();
            p.Run(inputArray);
     * 
     */
    struct Distance
    {
        public long h { get; set; }
        public long v { get; set; }
        public static Distance operator +(Distance d1 , Distance d2)
        {
            return new Distance() { 
                h = d1.h + d2.h,
                v = d1.v + d2.v
            };
        }
        
    }
    struct Point
    {
        public long x { get; set; }
        public long y { get; set; }
        public Distance GetDistanceTo(Point p)
        {
            return new Distance() { 
                 h = Math.Abs(x - p.x),
                 v = Math.Abs(y - p.y)
            };
        }
        public static bool operator ==(Point p1 , Point p2)
        {
            return (p1.x == p2.x) && (p1.y == p2.y);
        }
        public static bool operator !=(Point p1, Point p2)
        {
            return (p1.x != p2.x) || (p1.y != p2.y);
        }
        public override bool Equals(object obj)
        {
            return this == (Point)obj;
        }
        public override int GetHashCode()
        {
            return base.GetHashCode();
        }
    }
    /*struct P2P
    {
        public Point P1 { get; set; }
        public Point P2 { get; set; }
        public Distance D { get; set; }
        public static bool operator ==(P2P a, P2P b)
        {
            return ((a.P1 == b.P1) && (a.P2 == b.P2)) || (a.P2 == b.P1 && a.P1 == b.P2);
        }
        public static bool operator !=(P2P a, P2P b)
        {
            return !(a == b);
        }
        public override bool Equals(object obj)
        {
            return this == (P2P)obj;
        }
        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

    }
     * 
     */
    class Junction
    {
        public Point P { get; set; }
        public List<Junction> Neighbours { get; set; }
        public Junction()
        {
            Neighbours = new List<Junction>();
        }
    }
    
    class HackerRankTaxiCabProblem
    {
        public List<Tuple<Point, Point>> NonDrivables;
        Distance CarMaxDistnace;
        //Dictionary<Tuple<Junction, Junction>, Distance> runningDistance;
        Dictionary<Point, Point> PointToPoint;
        public HackerRankTaxiCabProblem()
        {
            NonDrivables = new List<Tuple<Point, Point>>();
            PointToPoint = new Dictionary<Point, Point>();
            
        }
        public void Run(string[] inputArray)
        {
            
            var i1 = inputArray[0].Split(new string[1]{" "}, StringSplitOptions.None);
            if (i1.Length < 3) return;
            var junctionCount = Convert.ToInt64(i1[0]);
            CarMaxDistnace = new Distance() { 
                h = Convert.ToInt64(i1[1]),
                v = Convert.ToInt64(i1[2])
            };
            List<Junction> junctions = new List<Junction>();
            for(var i = 1 ; i <= junctionCount; i++)
            {
                var p = inputArray[i].Split(new string[1] { " " }, StringSplitOptions.None);
                if(p.Length != 2) return;
                junctions.Add(new Junction()
                {
                    P = new Point()
                    {
                        x = Convert.ToInt64(p[0]),
                        y = Convert.ToInt64(p[1])
                    },
                    Neighbours = new List<Junction>()
                });
            }
            var jc = junctionCount + 1;
            for(var i = 1; i <= junctionCount - 1; i++)
            {
                var path = inputArray[jc++].Split(new string[1] { " " }, StringSplitOptions.None);
                if (path.Length != 2) return;
                var from = Convert.ToInt32(path[0]);
                var to = Convert.ToInt32(path[1]);
                junctions[from - 1].Neighbours.Add(junctions[to - 1]);
                junctions[to - 1].Neighbours.Add(junctions[from - 1]);
            }

            PerformBFS(junctions[0]);
            for (var i = 0; i < junctions.Count; i++)
                for (var k = 0; k < junctions.Count; k++)
                {
                    if (i == k) continue;

                }
                    


                    Console.WriteLine("Non - Drivable Point Pairs : " + NonDrivables.Count);
            Console.ReadLine();
        }
        void PerformBFS(Junction startingJunction)
        {
            Dictionary<Junction, bool> Visited = new Dictionary<Junction, bool>();    
            Queue<Junction> q = new Queue<Junction>();
            q.Enqueue(startingJunction);
            Visited.Add(startingJunction , true);
            /*Dictionary<Junction, Distance> runningDistance = new Dictionary<Junction, Distance>();
            runningDistance.Add(startingJunction, new Distance());*/
            while(q.Count > 0)
            {
                var j = q.Dequeue();

                //var distanceSoFar = runningDistance[j];
                j.Neighbours.ForEach(n => { 
                    if(!Visited.ContainsKey(n))
                    {
                        //runningDistance.Add(n, distanceSoFar + j.P.GetDistanceTo(n.P));
                        
                     
                            PointToPoint.Add(j.P, n.P);
                        q.Enqueue(n);
                        Visited.Add(n, true);
                    }
                }); 
                    
            }
            /*foreach(var de in runningDistance)
                if (de.Value.h > CarMaxDistnace.h || de.Value.v > CarMaxDistnace.v)
                    if (NonDrivables.Count(t => (t.Item1 == startingJunction.P && t.Item2 == de.Key.P) || (t.Item2 == startingJunction.P && t.Item1 == de.Key.P)) == 0)
                        NonDrivables.Add(new Tuple<Point, Point>(startingJunction.P, de.Key.P));*/
        }
        
    }
        
    
}
