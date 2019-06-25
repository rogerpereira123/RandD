using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class MyStack<T> where T : IComparable
    {
        int top;
        
        List<T> items;
        public MyStack()
        {
            items = new List<T>();
            top = -1;
            
        }
        public virtual void Push(T item)
        {
            
            items.Add(item);
            top++;

        }
        public virtual T Pop()
        {
            if (top  < 0)
                throw new Exception("Stack is empty");
            var r = items[top];
            items.RemoveAt(top);
            top--;
            return r;

        }
    }

    public class MyStackMin<T> : MyStack<T> where T: IComparable
    {
        List<T> mins;
        int topmin;

        public MyStackMin() : base()
        {
            mins = new List<T>();
            topmin = -1;
            
        }
        public override void Push(T item)
        {
            base.Push(item);
            if(mins.Count == 0 || mins[topmin].CompareTo(item) > 0)
            {
                mins.Add(item);
                topmin++;
            }
        }
        public override T Pop()
        {
            var item = base.Pop();
            if (topmin >= 0 && mins[topmin].CompareTo(item) == 0)
            {
                mins.RemoveAt(topmin);
                topmin--;
            }
            return item;

        }

        public T Min()
        {
            if (topmin < 0)
                throw new Exception("Stack empty");
            return mins[topmin];
        }
    }
}
