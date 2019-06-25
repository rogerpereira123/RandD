using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class Rotate
    {
        static void RightRotate(string[] A, int k)
        {
            var temp = new string[k];
            int j = 0;
            for (int i = A.Length - k; i < A.Length; i++) temp[j++] = A[i];
            j = (A.Length - k) - 1;
            for (int i = A.Length - 1; i >= 0 && j >= 0; i--)
                A[i] = A[j--];
            for (int i = 0; i < temp.Length; i++)
                A[i] = temp[i];
        }
        static void LeftRotate(string[] A, int k)
        {
            var temp = new string[k];
            for (int i = 0; i < k; i++)
                temp[i] = A[i];
            int j = 0;
            for (int i = k ; i < A.Length; i++)
                A[j++] = A[i];
            j = A.Length - k;
            for (int i = 0; i < temp.Length; i++)
                A[j++] = temp[i];



        }
        public static void Driver()
        {
            var a = new string[] {"a" , "b" , "c" , "d" , "e" };
            RightRotate(a, 2);
            Console.WriteLine(string.Join(" ", a));
            LeftRotate(a, 2);

            Console.WriteLine(string.Join(" ", a));
        }
    }
}
