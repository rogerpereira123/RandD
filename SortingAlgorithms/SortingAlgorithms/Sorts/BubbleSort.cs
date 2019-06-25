using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class BubbleSort
    {
        public static int Sort(int[] inputArray)
        {
            int iterationsRequired = 0;
            for (int i = 0; i < inputArray.Length; i++)
            {
                int key = inputArray[i];
                for(int j = i+1; j < inputArray.Length; j++)
                {
                    if (key >= inputArray[j])
                    {
                        inputArray[i] = inputArray[j];
                        inputArray[j] = key;
                        key = inputArray[i];
                    }
                    iterationsRequired++;
                }
                
            }

            return iterationsRequired;
        }
        public static void RecursiveBubbleSort(int[] inputArray)
        {
            SortRecursive(inputArray, 0);
        }
        static void SortRecursive(int[] inputArray,  int i)
        {
            if(i < inputArray.Length)
            {
                int key = inputArray[i];
                for (int j = i + 1; j < inputArray.Length; j++)
                {
                    if (key >= inputArray[j])
                    {
                        inputArray[i] = inputArray[j];
                        inputArray[j] = key;
                        key = inputArray[i];
                    }
                   
                }
                SortRecursive(inputArray, ++i);
            }
            

        }
    }
}
