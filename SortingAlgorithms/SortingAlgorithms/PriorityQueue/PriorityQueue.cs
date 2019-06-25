using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    //Priority Queue implementation using Min Heap
    public class PriorityQueue<T> where T : IComparable<T>
    {
        List<T> Data { get; set; }
        public PriorityQueue()
        {
            Data = new List<T>();
        }
        void Swap(int i , int j)
        {
            if (i == j) return;
            T temp = Data[i];
            Data[i] = Data[j];
            Data[j] = temp;
        }
        //O(log n)
        public void Enqueue(T item)
        {
            //Add item to list
            Data.Add(item);
            var li = Data.Count - 1;
            //Make sure that min-heap property is satisifed
            while(li > 0)
            {
                //find Parent
                int pi = (li - 1) / 2;
                //Min Heap....CompareTo Returns 1 or 0 when the Data[li] priority value is higher or equal (meaning the actual priority is lower than the parent Data[pi]) So min heap property is satisfied and break
                //If parent priority is higher (actual value is lower) than child....break...min heap property is satisified
                if (Data[pi].CompareTo(Data[li]) <= 0) break;
                //Else Swap items at parent and current index
                Swap(li, pi);
                //set current index to be parent index
                li = pi;
            }
        }
        //O(log n)
        public T Dequeue()
        {
            if (Data.Count == 0) return default(T);
            //Set item at the front of the queue as the item to return
            var li = Data.Count - 1;
            T item = Data[0];
            //Swap the last item in the queue with the first item
            Swap(0, li);
            //remove the last item 
            Data.RemoveAt(li);
            --li;
            //Now make sure that min-heap property is satisified from 0 till last index 
            var pi = 0;
            while(true)
            {
                var lci = 2 * pi + 1; //Left child
                if (lci > li) break; // if left child is greater than the last index we are done break
                var rci = lci + 1; // right child
                //if both right child and left child priorities are lower than the parent priority (actual values higher than the parent), break because we are done the min heap property is satisfied
                if (Data[pi].CompareTo(Data[lci]) <= 0 && Data[pi].CompareTo(Data[rci]) <= 0) break;
                //else see which child has higher priority and swap parent with that child and set that child to be new parent
                if (rci <= li && Data[rci].CompareTo(Data[lci]) <= 0)
                {
                    Swap(pi, rci);
                    pi = rci;
                }
                else
                {
                    Swap(pi, lci);
                    pi = lci;
                }
            }
            return item;
        }
    }
}
