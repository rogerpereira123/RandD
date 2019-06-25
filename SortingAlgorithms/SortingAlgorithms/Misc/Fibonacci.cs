using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections;

namespace SortingAlgorithms
{
    public static class Fibonacci
    {
        
        //O(2^n) becuase it evaluates to a binary tree with height n 
        public static int Generate(int n)
        {
            if (n == 0 || n == 1) return n;
            else
                return Generate(n - 1) + Generate(n - 2);
        }
        //O(n) runtime
        public static int GenerateWithLoop(int n)
        {
            if (n <= 1) return n;
            int num1 = 0;
            int num2 = 1;
            int result = 0;
            for (int i = 1; i < n; i++)
            {
                result = num1 + num2;
                num1 = num2;
                num2 = result;
            }
            return result;
        }


        //O(n) with O(n) space

        static Hashtable M = new Hashtable();

        public static int GenerateWithDynamicPrograming(int n)
        {

            if (n <= 1) return n;
            if (M.ContainsKey(n))
                return (int)M[n];
            var result = GenerateWithDynamicPrograming(n - 1) + GenerateWithDynamicPrograming(n - 2);
            M.Add(n, result);
            return result;
        }
    }
    public class FibLinearRecursion
    {
        const ulong MOD = 1000000007;

        static ulong[,] MultiplyMatrix(ulong[,] a, ulong[,] b)
        {
            ulong[,] c = new ulong[a.GetLength(0), b.GetLength(1)];
            for (int i = 0; i < a.GetLength(0); i++)
                for (int j = 0; j < b.GetLength(1); j++)
                    for (int k = 0; k < b.GetLength(0); k++)
                        c[i, j] = (c[i, j] + (a[i, k] * b[k, j])) %MOD;
            return c;
        }
        static ulong[,] ExpSquaring(ulong[,] a, ulong n)
        {
            if (n == 1) return a;
            if (n % 2 == 0)
            {
             
                    var r = ExpSquaring(a, n / 2);
                  return MultiplyMatrix(r, r);

            }
            else
            {
                    var r = ExpSquaring(a, (n - 1) / 2);
                    return MultiplyMatrix(MultiplyMatrix(r,r) , a);
                
            }
        }
        static ulong Fib(ulong n)
        {
            
            if (n <= 1) return n;
            var a = new ulong[2, 2] { 
                {1 ,1}, {1,0}
            };
            
            var c = ExpSquaring(a, n);
            return c[0, 1];
        }
        static ulong FibSumMod(ulong n, ulong m)
        {
            if (n == m) return Fib(m);
            var fibn = n -1 < 0 ? 0 : Fib(--n + 2)   - 1;
            var fibm = m- 1 < 0 ? 0 : Fib(m + 2) - 1;
           
            return ((fibm - fibn) + MOD ) % MOD ;
        }
        public static void Driver()
        {
            var t = Convert.ToInt32(Console.ReadLine());
            while (t-- > 0)
            {
                var s = Console.ReadLine().Split(new char[1] { ' ' });
                var n = Convert.ToUInt64(s[0]) ;
                var m = Convert.ToUInt64(s[1]) ;
                Console.WriteLine(FibSumMod(n, m));
            }

            Console.Read();
        }
    }
}

