using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class MatrixTraversal
    {
        public static void ZigZagTraverse(int[,] A)
        {
            int m = A.GetLength(0);
            int n = A.GetLength(1);
            int c = 0;
            for(var r = 0 ; r < m; r++)
            {
                if(r %2 == 0)
                {
                    c = 0;
                    while(c < n)
                    {
                        Console.Write(A[r, c] + " ");
                        c++;
                    }
                }
                else
                {
                    c = n - 1;
                    while(c >= 0)
                    {
                        Console.Write(A[r, c] + " ");
                        c--;
                    }
                }
            }

        }
        public static void SpiralTraverse(int[,] A , int startingRowIndex,  int startingColumnIndex , int m , int n)
        {
           
            if (startingRowIndex >= m) return;
            if (startingColumnIndex >= n) return;
            int i = startingRowIndex,j = startingColumnIndex;
            for(j = startingColumnIndex; j < n; j++ )
                Console.Write(A[i, j] + " ");

            startingRowIndex++;
            for (i = startingRowIndex; i < m; i++ )
                Console.Write(A[i, n-1] + " ");

            n--;
            if(startingRowIndex < m)
            {
                for (j = n-1; j >= startingColumnIndex; j--)
                    Console.Write(A[m - 1, j] + " ");
                m--;
            
            }
            if(startingColumnIndex < n)
            {
                for (i = m - 1; i >= startingRowIndex; --i)
                    Console.Write(A[i, startingColumnIndex] + " ");
                startingColumnIndex++;
            }
            SpiralTraverse(A, startingRowIndex, startingColumnIndex, m, n);

        }
    }
}
