using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class TowerOfHanoi
    {
        Stack<int> source = new Stack<int>();
        Stack<int> destination = new Stack<int>();
        Stack<int> aux = new Stack<int>();
        public TowerOfHanoi(int n)
        {
            for (int i = n; i >= 1; i--)
                source.Push(i);
        }
        void ActualMove(Stack<int> s , Stack<int> d)
        {
            d.Push(s.Pop());
        }
        //Runtime O(2^n)
        void Move(int n , Stack<int> s, Stack<int> d, Stack<int> a)
        {
            if(n > 0)
            {
                Move(n - 1, s, a , d);
                ActualMove(s, d);
                Move(n - 1, a, d , s);
            }
        }
        public void Solve()
        {
            Move(source.Count, source, destination, aux);
        }
    }
}
