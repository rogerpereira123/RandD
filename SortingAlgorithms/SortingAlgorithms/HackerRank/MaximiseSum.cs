using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.HackerRank
{
    public class MaximiseSum
    {
        List<long[]> getSubArrays(long[] A)
        {
            List<long[]> result = new List<long[]>();
            List<long> running = new List<long>();
            long j = 0;
            while (j < A.Length)
            {
                running.Clear();
                for (var i = j; i < A.Length; i++)
                {

                    running.Add(A[i]);
                    result.Add(running.ToArray());

                }
                j++;
            }
            return result;
        }
        public long MaxSum(long[] A , long m)
        {
            var subarrays = getSubArrays(A);
            long maxModulo = 0;
            subarrays.ForEach(sb => maxModulo = (sb.Sum() % m) > maxModulo ? (sb.Sum() % m) : maxModulo);
            return maxModulo;
        }
    }
}
