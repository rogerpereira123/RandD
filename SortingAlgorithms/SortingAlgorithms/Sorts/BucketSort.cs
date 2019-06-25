using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class BucketSort
    {
        public static void Sort(int[] A)
        {
            int length = A.Length;
            int maxElement = 0;
            for (var i = 0; i < length; i++)
                if (A[i] > maxElement) maxElement = A[i];
            
            int[] buckets = new int[maxElement + 1];
            for (var i = 0; i < length; i++)
                buckets[A[i]]++;
            for (int i = 0, j = 0; i <= maxElement; i++)
                while (buckets[i]-- > 0)
                    A[j++] = i;
        }
    }
}
