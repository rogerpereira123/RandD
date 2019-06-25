using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class PowerOfANumber
    {
        public static double Compute(double number , double power)
        {
            if (power == 1) return number;
            if (power % 2 == 0)
            {
                double n = Compute(number, power / 2);
                return n * n;
            }
            else
            {
                double n = Compute(number, (power - 1) / 2);
                return n * n * number;

            }
        }
    }
}
