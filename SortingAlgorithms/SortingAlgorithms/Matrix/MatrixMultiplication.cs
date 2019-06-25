using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class MatrixMultiplication
    {

        public static int[,] Multiply(int[,] A, int[,] B)
        {
            if (A.GetLength(1) != B.GetLength(0)) return null;
            int m = A.GetLength(0);
            int n = A.GetLength(1);
            int p = B.GetLength(1);
            
            int[,] result = new int[m, p];
            for (int i = 0; i < m; i++)
                for (int j = 0; j < p; j++)
                    for (int k = 0; k < n; k++)
                        result[i, j] += A[i,k] * B[k,j];
                


            return result;
        }

    }
}
