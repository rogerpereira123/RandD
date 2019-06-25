using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Misc
{
    /*
     var n = Convert.ToInt32(Console.ReadLine());
            List<long> input = new List<long>();


            var splits = Console.ReadLine().Split(new char[1] { ' ' } , StringSplitOptions.RemoveEmptyEntries);
            foreach (var s in splits) input.Add(Convert.ToInt64(s));

           
            
            

            var q = Convert.ToInt32(Console.ReadLine());
            System.Diagnostics.Stopwatch w = new System.Diagnostics.Stopwatch();
            while (q-- > 0)
            {

                splits = Console.ReadLine().Split(new char[1] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                var i = Convert.ToInt32(splits[0]);
                var j = Convert.ToInt32(splits[1]);
                
                w.Start();
                Console.WriteLine(Maximize(input.ToArray(), i - 1, j - 1));
                w.Stop();
            }
            Console.Write("Total Time : " + w.Elapsed.TotalSeconds);
            Console.Read();
     */
    class MaximizeSubarraySum
    {
        public static long Maximize(long[] A)
        {

            if (A.Length == 0) return 0;
            
            long currentMax = A[0];
            long maxSoFar = A[0];
            var i = 1;
            var j = A.Length - 1;
            while (i <= j)
            {
                currentMax = Math.Max(A[i], A[i] + currentMax);
                maxSoFar = Math.Max(currentMax, maxSoFar);
                i++;
            }
            return maxSoFar;
        }
        public static int Maximize(int[] A , int  i , int j)
        {

            if (A.Length == 0) return 0;

            int currentMax = A[i];
            int maxSoFar = A[i];
            i++;
            while (i <= j)
            {
                currentMax = Math.Max(A[i], A[i] + currentMax);
                maxSoFar = Math.Max(currentMax, maxSoFar);
                i++;
            }
            return maxSoFar;
        }
    }
}
