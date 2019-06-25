using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Numerics;

namespace SortingAlgorithms
{
    

    public class FactorialTrailingZeroes
    {
        public static long GetTrailingZeroes(int n)
        {
            long i = 5;
            long count = 0;
            while (n / i > 0)
            {
                count = count + (n / i);
                i = i * 5;
            }
            return count;
        }
        public static void Driver()
        {
            var t = Convert.ToInt32(Console.ReadLine());
            while (t-- > 0)
            {
                var n = Convert.ToInt32(Console.ReadLine());
                Console.WriteLine(GetTrailingZeroes(n));

              
                
            }
            
        }
    }
}
