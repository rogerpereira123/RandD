using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class InsertionSort
    {
        public static void Sort(int[] A)
        {
            for(int j = 1; j < A.Length; j++)
            {
                int i = j - 1;
                int key = A[j];
                while(i >= 0 && A[i] > key)
                {
                    A[i+1] = A[i];
                    i--;
                }
                A[i+1] = key;
            }
        }
    }
}
