using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Misc
{
    public class RandomNumbers
    {
        public static string Generate(int n)
        {
            if (n > 9) throw new Exception("Cannot generate");
            Random r = new Random();
            StringBuilder sb = new StringBuilder();
            int i = n;
            while(i > 0)
            {
                sb.Append(r.Next(i--, n));
            }
            return sb.ToString();
        }
        //Given a function f1() which always generate 0 or 1 with equal probability, write a function f29() which will generate numbers between 0 to 29 with equal distribution.
        //The normal aprroach of generating a random index and swapping with i (while i gows down from 29 to 0) works 
        //But interviewer said thats prectable and we need a better solution.
        //So my idea is to scamble the input array itself before applying the above method to generate the random numbers
        //Approach
        static Random r = new Random();
        static int f1()
        {
            return r.Next(0, 2);
        }
        static int[] a = new int[30];
       
        static double GetNext()
        {
            int num = 2;
            
            double result = 0;
            result = (f1() * Math.Pow(num, 4)) + (f1() * Math.Pow(num, 3))
                + (f1() * Math.Pow(num, 2)) + (f1() * Math.Pow(num, 1)) + f1();

            
            return result;
        }
        public static void Generate()
        {
           
            int i = 30;
            while (i-- > 0)
            {
                var r = GetNext();
                while (r >= 30) r = GetNext();
                Console.Write(r + " ");
            }

        }

    }
}
