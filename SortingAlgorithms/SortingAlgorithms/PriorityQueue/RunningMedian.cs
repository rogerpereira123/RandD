using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class RunningMedian
    {

        public struct MinHeap
        {
            List<int> items; 
            
            void Swap(int i, int j)
            {
                var temp = items[i];
                items[i] = items[j];
                items[j] = temp;
            }
            public void Add(int item)
            {
                if (items == null) items = new List<int>();
                items.Add(item);
                var li = items.Count - 1;
                int pi;
                while (true)
                {
                    pi = (li - 1) / 2;
                    if (pi < 0) break;
                    if (items[pi] > items[li])
                    {
                        Swap(pi, li);
                        li = pi;
                    }
                    else break;
                }
            }
            public int Remove()
            {
                var result = items[0];
                Swap(0, items.Count - 1);
                items.RemoveAt(items.Count - 1);
                var i = 0;
                int smallest;
                while (true)
                {
                    smallest = i;
                    var lc = (2 * i) + 1;
                    var rc = lc + 1;
                    if (lc < items.Count && items[lc] < items[smallest])
                        smallest = lc;
                    if (rc < items.Count && items[rc] < items[smallest])
                        smallest = rc;
                    if (i != smallest)
                    {
                        Swap(i, smallest);
                        i = smallest;
                    }
                    else break;


                }
                return result;
            }
            public int Peek()
            {
                if (items.Count > 0)
                    return items[0];
                else return -1;
            }
            public int Count
            {
                get
                {
                    return items == null ? 0 : items.Count;

                }
            }
            public void Clear()
            {
                if (items != null)
                    items.Clear();
                
            }
        }
        public struct MaxHeap
        {
            List<int> items;
           
            void Swap(int i, int j)
            {
                var temp = items[i];
                items[i] = items[j];
                items[j] = temp;
            }
            public void Add(int item)
            {
                if (items == null) items = new List<int>();
                items.Add(item);
                var li = items.Count - 1;
                int pi;
                while (true)
                {
                    pi = (li - 1) / 2;
                    if (pi < 0) break;
                    if (items[pi] < items[li])
                    {
                        Swap(pi, li);
                        li = pi;
                    }
                    else break;
                }
            }
            public int Remove()
            {
                var result = items[0];
                Swap(0, items.Count - 1);
                items.RemoveAt(items.Count - 1);
                var i = 0;
                int largest;
                while (true)
                {
                    largest = i;
                    var lc = (2 * i) + 1;
                    var rc = lc + 1;
                    if (lc < items.Count && items[lc] > items[largest])
                        largest = lc;
                    if (rc < items.Count && items[rc] > items[largest])
                        largest = rc;
                    if (i != largest)
                    {
                        Swap(i, largest);
                        i = largest;
                    }
                    else break;


                }
                return result;
            }
            public int Peek()
            {
                if (items.Count > 0)
                    return items[0];
                else return -1;
            }
            public int Count
            {
                get
                {
                    return items == null ? 0 : items.Count;

                }
            }
            public void Clear()
            {
                if(items != null)
                    items.Clear();
            }

        }
        static void Balance(MaxHeap max, MinHeap min)
        {
            int diff = Math.Abs(max.Count - min.Count);
            if (diff <= 1) return;
            if (max.Count > min.Count)
                min.Add(max.Remove());
            else max.Add(min.Remove());
        }
        public static void Driver()
        {
            var t = Convert.ToInt32(Console.ReadLine());
            var input = new List<int>();

            while(t-- > 0)
            {
                while (true)
                {
                    var i = Convert.ToInt32(Console.ReadLine());
                    input.Add(i);
                    if(i == 0) break;
                }
            }

            var max = new MaxHeap();
            var min = new MinHeap();

            foreach (var i in input)
            {
                if (i == 0)
                {
                    max = new MaxHeap();
                    min = new MinHeap();
                    continue;
                }

                if (i == -1)
                {
                    if (max.Count >= min.Count) Console.WriteLine(max.Remove());
                    else Console.WriteLine(min.Remove());
                    Balance(max, min);
                    continue;
                }
                if (max.Count == 0 && min.Count == 0)
                    max.Add(i);
                else if (max.Count == 1 && min.Count == 0 && i >= max.Peek())
                    min.Add(i);
                else if (max.Count == 1 && min.Count == 0 && i < max.Peek())
                {
                    min.Add(max.Remove());
                    max.Add(i);
                }
                else
                {
                    if (i <= max.Peek()) max.Add(i);
                    else min.Add(i);
                }
                Balance(max, min);

            }
        }
    }
}
