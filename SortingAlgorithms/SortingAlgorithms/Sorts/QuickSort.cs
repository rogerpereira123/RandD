using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class QuickSortAlgorithms
    {
        /*Running Time O(n^2) for sorted, reversed sorted and the case where partition always gives 0 & (n-1) partitions...*/
        public static void QuickSort(int[] A, int p , int r)
        {
            if (p >= r)
                return;
            int q = Partition(A, p, r);
            QuickSort(A, p, q - 1);
            QuickSort(A, q+1, r);
        }
        /*Running Time O(nlogn) */
        public static void RandomizedQuickSort(int[] A, int p, int r)
        {
            if (p >= r) return;
            int q = RandomizedPartition(A, p, r);
            RandomizedQuickSort(A, p, q - 1);
            RandomizedQuickSort(A, q + 1, r);


        }
        static int RandomizedPartition(int[] A, int p , int q)
        {
            var i =  (new Random()).Next(p, q);
            Exchange(A, i, p);
            return Partition(A, p, q);
        }
        static int Partition(int[] A, int p, int q)
        {
            int i = p;
            int pivot = A[p];

            for (int j = p + 1; j <= q; j++)
            {
                if (A[j] <= pivot)
                {
                    i++;
                    Exchange(A, i, j);
                }

            }
            Exchange(A, p, i);
            return i;

        }
       /* static public int Partition(int[] numbers, int left, int right)
        {
            int pivot = numbers[left];
            while (true)
            {
                while (numbers[left] < pivot)
                    left++;

                while (numbers[right] > pivot)
                    right--;

                if (left < right)
                {
                    int temp = numbers[right];
                    numbers[right] = numbers[left];
                    numbers[left] = temp;
                }
                else
                {
                    return right;
                }
            }
        }*/
        static void Exchange(int[] A, int i , int j)
        {
            int temp = A[i];
            A[i] = A[j];
            A[j] = temp;
        }

        
    }
   
}
