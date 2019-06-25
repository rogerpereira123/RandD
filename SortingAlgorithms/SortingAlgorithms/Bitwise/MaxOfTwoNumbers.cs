using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Bitwise
{
    public class MaxOfTwoNumbers
    {
        public static int Max(int a , int b)
        {
            int c = a - b;
            int signbit = c >> 31;
            signbit = signbit & 1;
            return a - (signbit * c);
        }
        public static void Driver()
        {
            int a = -5, b = -1;
            Console.WriteLine("Max of " + a + " & " + b + " is " + Max(a,b));
        }
    }
}
