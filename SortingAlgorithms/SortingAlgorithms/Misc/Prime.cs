using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Misc
{
    class Prime
    {
        static Dictionary<long, bool> m = new Dictionary<long, bool>();
        public static bool IsPrimeSqrt(long l)
        {
            var result = true;
            if (l == 1) return false;
            var sqrt = Math.Sqrt(l);
            for (var i = 2; i <= sqrt; i++)
                if (l % i == 0) return false;
            return result;
        }
        public static bool IsPrime(long l)
        {
            var result = true;
            if (l <= 1) return false;
            if (l <= 3) return true;
            if (l % 2 == 0 || l % 3 == 0) return false;
            var sqrt = Math.Sqrt(l);
            for (var i = 5; i <= sqrt; i = i + 6)
                if (l % i == 0 || l % (i+2) == 0) return false;
            return result;
        }
        public static List<int> PrimeFactors(int n)
        {
            List<int> factors = new List<int>();
            int d = 2;
            while (n > 1)
            {
                while (n % d == 0)
                {
                    factors.Add(d);
                    n = n / d;
                }
                d++;
                if (d * d > n)
                {
                    if (n > 1)
                    {
                        factors.Add(n);
                        break;
                    }
                }
                
            }
            return factors;
        
        }
        public static void Generate(long min, long max)
        {
            while (min <= max)
            {
                if(m.ContainsKey(min) && m[min])
                    Console.WriteLine(min);
                else if(m.ContainsKey(min) && !m[min])
                {
                    min++;
                    continue;
                }
                else
                {
                    if (IsPrime(min))
                    {
                        Console.WriteLine(min);
                        m.Add(min, true);
                    }
                    else m.Add(min, false);
                }
                min++;
            }

        }
    }
}
