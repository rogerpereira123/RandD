

using System;

namespace SortingAlgorithms.Misc
{
    public class NumberOfCombinationsAddingUptoANumber
    {
        /*
         * Write a function that, given:
            an amount of money
            a list of coin denominations
            computes the number of ways to make amount of money with coins of the available denominations.
            Example: for amount=4 (4¢) and denominations=[1,2,3] (1¢, 2¢ and 3¢), your program would output 4—the number of ways to make 4¢ with those denominations:
            1¢, 1¢, 1¢, 1¢
            1¢, 1¢, 2¢
            1¢, 3¢
            2¢, 2¢
         */
        public static int GetNumberOfCombinationsAddingUptoANumber(int n, int[] a)
        {
            if (n == 0) return 1;
            if (n < 0) return 0;
            if (a.Length == 0) return 0;
            int result = 0;
            int current = a[0];
            int[] remainings;
            if (a.Length == 1) remainings = new int[]{};
            else
            {
                remainings = new int[a.Length - 1];
                Array.Copy(a, 1, remainings, 0, a.Length - 1);
            }
            while (n >= 0)
            {
                result += GetNumberOfCombinationsAddingUptoANumber(n, remainings);
                n -= current;
            }
            return result;

        }
    }
}
