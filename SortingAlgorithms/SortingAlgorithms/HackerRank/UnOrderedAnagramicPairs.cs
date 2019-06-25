using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.HackerRank
{
    public class UnOrderedAnagramicPairs
    {
        public int Compute(string A)
        {
            if (A == null || A == string.Empty) return 0;
            //Dictionary<string , int> result = new Dictionary<string, int>();
            List<string> temp = new List<string>();
            List<char> running = new List<char>();
            int j = 0;
            while (j < A.Length)
            {
                running.Clear();
                for (var i = j; i < A.Length; i++)
                {

                    running.Add(A[i]);
                    var s = new string(running.OrderBy(c => c).ToArray());
                    temp.Add(s);
                   
                }
                j++;
            }
            var o = from s in temp
                    group s by s into g
                    where g.Count() > 1
                    select new { k = g.Key , c =  g.Count()};
                   
            return o.Sum( sb => sb.c);
        }
        

    }
}
