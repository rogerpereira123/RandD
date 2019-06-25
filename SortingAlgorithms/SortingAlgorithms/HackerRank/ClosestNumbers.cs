using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.HackerRank
{
    public class ClosestNumbers
    {
        public List<long> Compute(long[] A)
        {
            if (A.Length < 2) return new List<long>();
            Array.Sort(A);
            var result = new List<long>();
            long minDifference = Math.Abs(A[0] - A[1]);
            result.Add(A[0]);
            result.Add(A[1]);
            for (int i = 1; i < A.Length; i++)
            {
                if (i + 1 >= A.Length) continue;
                if(minDifference > Math.Abs(A[i] - A[i + 1]))
                {
                    result.Clear();
                    minDifference = Math.Abs(A[i] - A[i + 1]);
                    result.Add(A[i]);
                    result.Add(A[i+1]);
                }
                else if(minDifference == Math.Abs(A[i] - A[i + 1]))
                {
                    result.Add(A[i]);
                    result.Add(A[i + 1]);
                }

            }

                return result;        
        }
    }
}
