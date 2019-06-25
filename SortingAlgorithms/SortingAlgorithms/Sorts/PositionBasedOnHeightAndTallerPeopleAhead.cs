using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace SortingAlgorithms
{
    
    public class PositionBasedOnHeightAndTallerPeopleAhead
    {
        public struct Person : IComparable
        {
            public int Id { get; set; }
            public int H { get; set; }
            public int C { get; set; }
            public int CompareTo(object other)
            {
                var o = (Person)other;
                if (H < o.H) return -1;
                else if (H > o.H) return 1;
                else return 0;
            }
            
        }
        static void Swap(Person[] p, int i, int j)
        {
            if (i < 0 || j < 0 || i >= p.Length || j >= p.Length) return;
            var t = p[i];
            p[i] = p[j];
            p[j] = t;
        }
        static Person[] GetOrder(Person[] p)
        {
            Array.Sort(p);
            Person[] p1 = new Person[p.Length];
            Array.Copy(p, p1, p.Length);
            for (var i = 0; i < p.Length; i++)
            {
                var person = p[i];
                int ii = 0;
                for (ii = 0; ii < p1.Length; ii++) if (p1[ii].Equals(person)) break;
                int jj = 0;
                for (jj = ii + 1; jj < p1.Length; jj++) if (p1[jj].H > p1[ii].H) break;
                if (jj >= p1.Length)
                {
                    jj--;
                    if (ii == jj) continue;
                }
                var count = person.C;
                if(count == 0)
                {
                    var prev = ii - 1;
                    while (prev >= 0 && p1[prev].H > p1[ii].H) prev--;
                    Swap(p1, ii, ++prev);
                    continue;
                }
                var j = jj;
                var k = ii;
                while (count-- > 0)
                {
                    Swap(p1, k++, j++);
                }
            }
            return p1;
        }
        public static void Driver()
        {
            var t = Convert.ToInt32(Console.ReadLine());
            
            while (t-- > 0)
            {
                List<Person> people = new List<Person>();
                var n = Convert.ToInt32(Console.ReadLine());
                var n1 = n;
                var n2 = n;
                string heights = "";
                string counts = "";
                
                while(n1-- > 0)
                {
                    char read;
                    do
                    {
                        read = Convert.ToChar(Console.Read());
                        heights += read.ToString();
                    }
                    while (read != ' ' && read != '\n' && read != '\r');
                    heights += " ";

                }
                Console.Read();
                while (n2-- > 0)
                {
                    char read;
                    do
                    {
                        read = Convert.ToChar(Console.Read());
                        counts += read.ToString();
                    }
                    while (read != ' ' && read != '\n' && read != '\r');
                    counts += " ";

                }
                
                

                
                string[] stringHeights = heights.Split(new char[1] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                string[] stringCounts = counts.Split(new char[1] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                
                for (var i = 0; i < n; i++)
                {
                    people.Add(new Person()
                    {
                        Id = i + 1,
                        H = Convert.ToInt32(stringHeights[i]),
                        C = Convert.ToInt32(stringCounts[i])
                    });
                }


                var p = people.ToArray();
                p = GetOrder(p);
                foreach (var pi in p) Console.Write(pi.H + " ");
                Console.WriteLine("");
            }
        }
    }
}
