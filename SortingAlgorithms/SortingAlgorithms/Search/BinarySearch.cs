using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class BinarySearch
    {
        public static bool Search(int[] A, int v, int p , int q)
        {
            
            if(q < p)
                return false;
            int m = (p+q) / 2;
            if (v == A[m])
                return true;

            else
            {
                if (v < A[m])
                    return Search(A, v, p, m - 1);
                else return Search(A, v, m + 1, q);
            }

        }
        public static int? FindMinFromSortedAndRotatedAraay(int[] A)
        {
            int s = 0, e = A.Length - 1;
            int m;
            int? result= null;
            while(s < e)
            {
                m = (s + e) / 2;
                if (m < e && A[m + 1] < A[m])
                {
                    result = A[m + 1];
                    break;
                }
                if(m > s &&  A[m] < A[m-1])
                {
                    result = A[m];
                    break;
                }
                if(A[e] > A[m])
                {
                    
                    e = m - 1;
                }
                else
                {
                    s = m + 1;
                }
               
            }
            if (result == null) result = A[0];
            return result;

        }
       
    }
}
