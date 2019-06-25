using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Bitwise
{
    public class MultiplyTwoNumbers
    {
        public static int Multiply(int a , int b)
        {
            bool negateResult = false;
            if (a < 0 && b < 0) negateResult = false;
            else if (a < 0) negateResult = true;
            else if (b < 0) negateResult = true;
            int r = 0;
            b = Math.Abs(b);
            a = Math.Abs(a);
            while(b != 0)
            {
                if ((b & 1) == 1)
                    r = AddTwoNumbers.Add(r, a);
                a = a << 1;
                b = b >> 1;
            }
            if (negateResult)
                r = (~r) + 1;
            return r;
        }
        public static void Driver()
        {
            int a = 10, b = 20;
            Console.WriteLine("{0} * {1} = {2} ", a, b, Multiply(a , b));

        }
    }
}
