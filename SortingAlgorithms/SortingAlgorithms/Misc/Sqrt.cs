using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Misc
{
    public class Sqrt
    {
        public static double Compute(int n , double tolerence)
        {
            double x = n;
            double newx = 0;
            while(true)
            {
                newx = 0.5 * (x + n / x);
                if (Math.Abs(x - newx) <= tolerence) break;
                x = newx;
            }
            return newx;
        }
    }
}
