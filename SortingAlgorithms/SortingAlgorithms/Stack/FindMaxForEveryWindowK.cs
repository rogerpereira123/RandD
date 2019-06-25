using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Stack
{
    class MStack {
        Stack<int> s = new Stack<int>();
        Stack<int> maximums = new Stack<int>();
        public void Push(int item) {
            s.Push(item);
            if(maximums.Count == 0 || item >= maximums.Peek())
                maximums.Push(item);
        }
        public int Pop() {
            var r = s.Pop();
            if(r == maximums.Peek()) maximums.Pop();
            return r;
        }
        public int Max() {
            return maximums.Peek();
        }
        public int Count {
            get {
                return s.Count;
            }
                 
        }
    }
    class MQueue {
        MStack s1 = new MStack();
        MStack s2 = new MStack();
        public void Enqueue(int item) {
            s1.Push(item);
        }
        public int Dequeue() {
            if(s2.Count > 0) return s2.Pop();
            while(s1.Count > 0) s2.Push(s1.Pop());
            return s2.Pop();
        }
        public int Max() {
            if(s1.Count > 0 && s2.Count > 0 ) 
                return Math.Max(s1.Max() , s2.Max());
            else if(s1.Count > 0) return s1.Max();
            else return s2.Max();
        }
            
    }

    public class FindMaxForEveryWindowK
    {
        //O(n) with space n
        public static void Driver1(int[] tps, int k)
        {
            var q = new MQueue();
            for (int i = 0; i < tps.Length; i++)
            {
                if (i < k)
                {
                    q.Enqueue(tps[i]);
                    Console.WriteLine(q.Max());
                }
                else
                {
                    q.Dequeue();
                    q.Enqueue(tps[i]);
                    Console.WriteLine(q.Max());
                }
            }
        }
        //O(nk)
        public static void Driver2(int[] tps, int k)
        {
            var q = new Queue<int>();
            for (int i = 0; i < tps.Length; i++)
            {
                if (i < k)
                {
                    q.Enqueue(tps[i]);
                    Console.WriteLine(q.Max());
                }
                else
                {
                    q.Dequeue();
                    q.Enqueue(tps[i]);
                    Console.WriteLine(q.Max());
                }
            }
        }
    }
}
