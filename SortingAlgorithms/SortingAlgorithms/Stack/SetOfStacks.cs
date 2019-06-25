using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class SetOfStacks
    {
        int threshold;
        List<int[]> setOfStack = new List<int[]>();
        int top = -1;
        public SetOfStacks(int threshold)
        {
            if (threshold <= 0)
                throw new Exception("Threshold has to be positive int");
            this.threshold = threshold;

        }
        public void Push(int item)
        {
            top++;
            int setIndex = top / threshold;
            int stackIndex = top % threshold;
            if (setOfStack.Count == setIndex)
                setOfStack.Add(new int[threshold]);
            setOfStack[setIndex][stackIndex] = item;
        }
        public int Pop()
        {
            if (top < 0)
                throw new Exception("Stack is empty");
            int setIndex = top / threshold;
            int stackIndex = top % threshold;
            top--;
            var item = setOfStack[setIndex][stackIndex];
            setOfStack[setIndex][stackIndex] = 0;
            return item;
        }
        public int PopAtStack(int i)
        {
            if (i >= setOfStack.Count) throw new Exception("ith stack doenst exist");
            int newStackIndex = top % threshold;
            int newTop = (i * threshold) + newStackIndex;
            int item = setOfStack[i][newStackIndex];
            setOfStack[i][newStackIndex] = 0;
            int newSetIndex = 0;
            int nextSetIndex= 0;
            int nextStackIndex = 0;
            while(newTop + 1 <= top)
            {
                newSetIndex = newTop / threshold;
                newStackIndex = newTop % threshold;

                nextSetIndex = (newTop + 1) / threshold;
                nextStackIndex = (newTop + 1) % threshold;

                setOfStack[newSetIndex][newStackIndex] = setOfStack[nextSetIndex][nextStackIndex];

                newTop++;
            }
            top--;
            return item;
        }
    }
}
