using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Misc
{
    public class TwoNumbersInTwoSortedArraysAddingUptoAnotherNumber
    {
        public static void Find(int[] A, int[] B, int c)
        {
            int maxi = -1, maxj = -1, maxsum = int.MaxValue;
            for (int i = 0; i < A.Length; i++)
            {
                int x = c - A[i];
                bool isFound = false;
                int m=0, k = 0, l = B.Length - 1;
                while (k <= l)
                {
                    m = (k + l) / 2;
                    if (B[m] == x)
                    {
                        maxi = i;
                        maxj = m;
                        maxsum = c;
                        isFound = true;
                        break;
                    }
                    else if (x < B[m])
                    {
                        l = m - 1;

                    }
                    else k = m + 1;
                }
                if (!isFound)
                {
                    if (A[i] + B[m] <= c)
                    {
                        if (maxsum <= A[i] + B[m] || maxsum == int.MaxValue)
                        {
                            maxi = i;
                            maxj = m;
                            maxsum = A[i] + B[m];
                        }
                    }

                }
            }
            Console.WriteLine("Max i = " + maxi + " Max j = " + maxj);

        }

        public static void FindFaster(int[] A, int[] B, int c)
        {
            int maxi = -1, maxj = -1, maxsum = int.MaxValue;
            int i = 0, j = B.Length - 1;
            while(i < A.Length && j >= 0)
            {
                if (A[i] + B[j] == c)
                {
                    maxi = i;
                    maxj = j;
                    maxsum = c;
                    i++;
                    j--;
                }
                else if (A[i] + B[j] < c)
                {
                    if (maxsum == int.MaxValue || maxsum < A[i] + B[j])
                    {
                        maxsum = A[i] + B[j];
                        maxi = i;
                        maxj = j;
                    }
                    i++;
                }
                else j--;
            }
            Console.WriteLine("Max i = " + maxi + " Max j = " + maxj);

        }
    }
}
