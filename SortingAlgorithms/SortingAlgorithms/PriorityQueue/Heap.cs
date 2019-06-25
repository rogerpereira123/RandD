using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class Heap
    {
        public static bool IsMinHeap(int[] A)
        {
            if (A.Length <= 1) return true;
            var result = true;
            for(var i = 0; i < A.Length; i++)
            {
                int lc = 2 * i + 1;
                int rc = lc + 1;
                if (lc >= A.Length) break;
                if (A[i] > A[lc]) return false; // Reverse For Max Heap Check
                if (rc < A.Length && A[i] > A[rc]) return false; // Reverse For Max Heap Check
            }
            return result;
        }
        public static bool IsMaxHeap(int[] A)
        {
            if (A.Length <= 1) return true;
            var result = true;
            for (var i = 0; i < A.Length; i++)
            {
                int lc = 2 * i + 1;
                int rc = lc + 1;
                if (lc >= A.Length) break;
                if (A[i] < A[lc]) return false; // Reverse For Max Heap Check
                if (rc < A.Length && A[i] < A[rc]) return false; // Reverse For Max Heap Check
            }
            return result;
        }
        public static bool IsMinHeapRecursive(int[] A , int i)
        {
            var result = true;
            if (i >= A.Length) return result;
            int lc = 2 * i + 1;
            int rc = lc + 1;
            if (lc < A.Length && A[i] > A[lc]) return false;
            if (rc < A.Length && A[i] > A[rc]) return false;
            result = IsMinHeapRecursive(A, lc);
            if (result) result = IsMinHeapRecursive(A, rc);
            return result;
        }
        public static bool IsMaxHeapRecursive(int[] A, int i)
        {
            var result = true;
            if (i >= A.Length) return result;
            int lc = 2 * i + 1;
            int rc = lc + 1;
            if (lc < A.Length && A[i] < A[lc]) return false;
            if (rc < A.Length && A[i] < A[rc]) return false;
            result = IsMaxHeapRecursive(A, lc);
            if (result) result = IsMaxHeapRecursive(A, rc);
            return result;
        }
        static void Swap(int[] A , int i , int j)
        {
            A[i] ^= A[j];
            A[j] ^= A[i];
            A[i] ^= A[j];
        }
        public static void ToMaxHeap(int[] A)
        {
            if (A.Length <= 1) return;
            for(int i = A.Length / 2; i >= 0; i--)
            {
                
                int j = i;
                while(j < A.Length)
                {
                    int largest = j;
                    int lc = 2 * j + 1;
                    if (lc < A.Length && A[j] < A[lc]) largest = lc;
                    int rc = lc + 1;
                    if (rc < A.Length && A[largest] < A[rc]) largest = rc;
                    if (largest != j)
                    {
                        Swap(A, j, largest);
                        j = largest;

                    }
                    else break;
                }
            }
        }
        static void MaxHeapify(int[] A, int i)
        {
            if (i >= A.Length) return;
            int largest = i;
            int lc = 2 * i + 1;
            if (lc < A.Length && A[i] < A[lc]) largest = lc;
            int rc = lc + 1;
            if (rc < A.Length && A[largest] < A[rc]) largest = rc;
            if (largest != i)
            {
                Swap(A, i, largest);
                MaxHeapify(A, largest);
            }
        }
        public static void ToMaxHeapRecursive(int[] A)
        {
            for (int i = A.Length / 2; i >= 0; i--)
                MaxHeapify(A, i);
        }
    }
}
