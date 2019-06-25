using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class MergeSort
    {
        public static void Sort(int[] inputArray)
        {
            RecursiveSort(inputArray, 0, inputArray.Length-1);
            foreach (int i in inputArray)
                Console.Write(i + " ");
        }
        static void RecursiveSort(int[] inputArray , int startingIndex, int endingIndex )
        {
            if (startingIndex < endingIndex)
            {
                int q = (endingIndex + startingIndex) / 2;
                RecursiveSort(inputArray, startingIndex, q);
                RecursiveSort(inputArray, q+1, endingIndex);
                Merge(inputArray, startingIndex, q , endingIndex);
            }
            

        }
        static void Merge(int[] inputArray , int p , int q, int r)
        {
            int[] L = new int[q -p + 2 ];
            int[] R = new int[r - q + 1] ;
            Array.Copy(inputArray, p, L, 0, L.Length -1);
            Array.Copy(inputArray, q+1, R, 0, R.Length -1 );
            L[L.Length - 1] = int.MaxValue;
            R[R.Length - 1] = int.MaxValue - 1;
            int i = 0 , j = 0;
            for (int k = p; k <= r ; k++)
                if (L[i] <= R[j])
                    inputArray[k] = L[i++];
                else 
                    inputArray[k] = R[j++];

        }
    }
}
