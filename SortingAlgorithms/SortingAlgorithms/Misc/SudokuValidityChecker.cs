using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class SudokuValidityChecker
    {
        public static bool CheckValidSudokuArray(int[] A)
        {
            var result = true;
            int flag = 0;
            for(int i = 0; i < A.Length; i++)
            {
                int bit = 1 << A[i];
                if ((flag & bit) != 0) {
                    result = false;
                    break;
                }
                flag = flag | bit;
            }
            return result;
        }
    }
}
