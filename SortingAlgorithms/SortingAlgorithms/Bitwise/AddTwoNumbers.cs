using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Bitwise
{
    public class AddTwoNumbers
    {
        public static int Add(int a , int b)
        {
            int carry = 0;
            while(b != 0)
            {
                carry = a & b;
                a = a ^ b;
                b = carry << 1;
            }
            return a;
        }
        public static void Driver()
        {
            int a = 5;
            int b = 20;
            Console.WriteLine(a + " + " + b + " = " + Add(a, b));
        }

    }
}
