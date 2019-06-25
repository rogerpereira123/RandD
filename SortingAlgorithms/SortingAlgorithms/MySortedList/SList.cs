using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class SList<T> where T : IComparable<T>
    {
        List<T> items;
        public SList()
        {
            items = new List<T>();
        }
        public void Add(T item)
        {
            var i = Array.BinarySearch<T>(items.ToArray(), item);
            if (i < 0) i = ~i;
            items.Insert(i, item);
        }
        public IEnumerable<T> Values
        {
            get
            {
                return items;
            }
        }
        public void Remove(T item)
        {
            var i = Array.BinarySearch<T>(items.ToArray(), item);
            if (i < 0) return;
            items.RemoveAt(i);
        }
    }
    public static class MySortedList
    {
        public static void Driver()
        {
            SList<int> s = new SList<int>();
            Random r = new Random();
            for (var i = 0; i < 10; i++)
                s.Add(r.Next(20));

            foreach (var i in s.Values)
                Console.Write(i + " ");

            s.Remove(s.Values.ElementAt(3));
            Console.WriteLine();

            foreach (var i in s.Values)
                Console.Write(i + " ");


        }
    }
}
