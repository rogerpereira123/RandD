using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Numerics;

namespace SortingAlgorithms.HackerRank
{
    public class ModifiedFibonacci
    {
        public BigInteger Compute(BigInteger a , BigInteger b , int n)
        {
            if (n <= 0) return 0;
            var result = b;
            var temp = a;
            for(int i = 2 ; i < n; i++)
            {
                result = temp + (b * b);
                temp = b;
                b = result;
            }
            return result;
        }
    }
}
