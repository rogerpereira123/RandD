using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SortingAlgorithms.Misc;

namespace SortingAlgorithms.SegmentTrees
{
    //Time Complexity For Building O(n)
    //Space Complexity O(n)
    //Finding O(logn)
    public class SegmentTreeForFindingMax
    {
        int[] A;
        int[] segmentTree;
        public SegmentTreeForFindingMax(int[] input)
        {
            A = input;
            int segmentSize = input.Length * 2 - 1;
            int nearestPowerOfTwo = 2;
            if ((input.Length & 1) == 1)
            {
                while (nearestPowerOfTwo < input.Length) nearestPowerOfTwo *= nearestPowerOfTwo;
                segmentSize = nearestPowerOfTwo * 2 - 1;
            }
            segmentTree = new int[segmentSize];
            Build(0, A.Length - 1, 0);
        }
        void Build(int low, int high, int pos)
        {
            if(low == high)
            {
                segmentTree[pos] = A[low];
                return;
            }
            int mid = (low + high) / 2;
            Build(low, mid, pos * 2 + 1);
            Build(mid + 1, high, pos * 2 + 2);
            segmentTree[pos] = Math.Max(segmentTree[pos * 2 + 1], segmentTree[pos * 2 + 2]);
        }
        int FindMax(int qLow, int qHigh, int low, int high , int pos)
        {
            if (qLow <= low && qHigh >= high)
                return segmentTree[pos];
            if (qLow > high || qHigh < low)
                return Int32.MinValue;
            int mid = (low + high) / 2;
            var leftMax = FindMax(qLow, qHigh, low, mid, 2 * pos + 1);
            var rightMax = FindMax(qLow, qHigh, mid + 1, high, 2 * pos + 2);
            return Math.Max(leftMax, rightMax);
        }
        public int FindMax(int i , int j)
        {
            return FindMax(i, j, 0, A.Length - 1, 0);
        }

    }
    //Incomplete 
    public class SegmentTreeForFindingMaxSubarrySum
    {
        int[] A;
        int[] segmentTree;
        public SegmentTreeForFindingMaxSubarrySum(int[] input)
        {
            A = input;
            int segmentSize = input.Length * 2 - 1;
            int nearestPowerOfTwo = 2;
            if ((input.Length & 1) == 1)
            {
                while (nearestPowerOfTwo < input.Length) nearestPowerOfTwo *= nearestPowerOfTwo;
                segmentSize = nearestPowerOfTwo * 2 - 1;
            }
            segmentTree = new int[segmentSize];

            Build(0, A.Length - 1,0);
        }
        void Build(int low, int high, int pos )
        {
            if (low == high)
            {
                segmentTree[pos] = A[low];
                return;
            }
            int mid = (low + high) / 2;
            Build(low, mid, pos * 2 + 1 );
            Build(mid + 1, high, pos * 2 + 2 );
            
            segmentTree[pos] = MaximizeSubarraySum.Maximize(A , low, high);
        }
        int FindMax(int qLow, int qHigh, int low, int high, int pos, int currentSum)
        {
            if (qLow <= low && qHigh >= high)
                return segmentTree[pos];
            if (qLow > high || qHigh < low)
                return 0;
            int mid = (low + high) / 2;
            var left = FindMax(qLow, qHigh, low, mid, 2 * pos + 1 , currentSum);
            var right = FindMax(qLow, qHigh, mid + 1, high, 2 * pos + 2 , currentSum);
            currentSum = Math.Max(currentSum, currentSum + left + right);
            return currentSum;
        }
        public int FindMax(int i, int j)
        {
            return FindMax(i, j, 0, A.Length - 1, 0, 0);
        }

    }


}
