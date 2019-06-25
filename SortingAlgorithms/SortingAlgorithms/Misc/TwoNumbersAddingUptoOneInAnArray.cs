using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
/* Problem Statement
 * Given and array of numbers and a number k, return true if any two numbers sum up to k
 */
namespace SortingAlgorithms
{
    public class TwoNumbersAddingUptoOneInAnArray
    {
        //Linear search runtime O(n^2)
        public static bool Check(int[] A, int k)
        {
            bool result = false;
            
            for (int i = 0; i < A.Length; i++)
            {
                for (int j = i + 1; j < A.Length; j++)
                {
                    result = A[i] + A[j] == k;
                    if (result) break;
                    
                }
                if (result) break;
            }
            return result;
        }
        //Search runtime O(n log n)
        public static bool CheckBinarySearch(int[] A , int k)
        {
            bool result = false;
            for (int i = 0; i < A.Length; i++ )
            {
                if (k < A[i])
                    result = BinarySearch.Search(A, A[i] - k, i + 1, A.Length - 1);
                else result = BinarySearch.Search(A, k - A[i], i + 1, A.Length - 1);
                if (result) break;
            }
            
            return result;
        }
        //Much Efficient
        public static bool CheckWithSort(int[] A, int k)
        {
            bool result = false;
            Array.Sort(A);
            int l = 0, r = A.Length - 1;
            while(l < r)
            {
                if(A[l] + A[r] == k)
                {
                    result = true;
                    break;
                }
                else if (A[l] + A[r] > k) r--;
                else l++;
            }
            return result;
        }
        //No Sorting needed and useful when original ordering of array needs to be intact
        public static void CheckWithHT(int[] A, int m)
        {
            Dictionary<int, int> d = new Dictionary<int, int>();
            for (int i = 0; i < A.Length; i++)
            {
                if (d.ContainsKey(Convert.ToInt32(A[i])))
                {
                    Console.Write((d[Convert.ToInt32(A[i])] + 1) + " " + (i + 1));
                    Console.WriteLine();
                    break;
                }
                else
                    if (!d.ContainsKey(m - Convert.ToInt32(A[i])))
                        d.Add(m - Convert.ToInt32(A[i]), i);
            }
            Console.WriteLine("No Pair Found");
        }
    }
}
