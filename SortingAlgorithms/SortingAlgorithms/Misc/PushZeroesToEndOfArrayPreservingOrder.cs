using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class PushZeroesToEndOfArrayPreservingOrder
    {
       
        public static void Rearrange(int[] A)
        {
            int j = 0; //Count the non-zero elements 
            for (int i = 0; i < A.Length; i++)
                if (A[i] != 0)
                    A[j++] = A[i]; //
            while (j < A.Length) A[j++] = 0; //set these elements to zero
        }

        public static void Driver()
        {
            int[] A = new int[]{1,0,0,0,0,0,0,20};
            Rearrange(A);
            
        }
    }
}
