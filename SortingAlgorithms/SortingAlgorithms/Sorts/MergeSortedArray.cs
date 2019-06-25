using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class MergeSortedArray
    {
        public static  void Merge(int[] A, int[] B)
        {
            int empty = A.Length - B.Length;
            int i = 0, j = 0;
            while(true)
            {
                if (i >= A.Length || empty >= A.Length) break;
                if(j < B.Length && A[i] <= B[j])
                {
                    if(i == empty)
                    {
                        A[i] = B[j];
                        j++;
                        empty++;
                    }
                    i++;
                }
                else
                {
                    A[empty] = A[i];
                    A[i] = B[j];
                    i++;
                    j++;
                    empty++;
                }
            }
        }
        public static void Driver()
        {
            var a = new int[] { 4, 5, 9, 9, 0, 0, 0 };
            var b = new int[] {5, 6, 10 };
            Merge(a,b );
        }
    }
}
