using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    
    public class MyHashTable<K , V>
    {
        int size;
        LinkedList<KeyValuePair<K, V>>[] items;
        public MyHashTable(int size)
        {
            this.size = size;
            items = new LinkedList<KeyValuePair<K, V>>[size];

        }
        protected int GetPosition(K key)
        {
            return Math.Abs(key.GetHashCode() % size);
        }
        public void Add(K key, V value)
        {
            int position = GetPosition(key);
            GetLinkedList(position).AddLast(new LinkedListNode<KeyValuePair<K, V>>(new KeyValuePair<K, V>(key, value)));
        }
        public V Find(K key)
        {
            int position = GetPosition(key);
            var elements = GetLinkedList(position).Where(k => k.Key.Equals(key));
            if (elements.Count() > 0) return elements.ElementAt(0).Value;
            return default(V);
        }
        public V this[K key]
        {
            get
            {
                return Find(key);
            }
            set
            {
                Add(key, value);
            }
        }
   
        public LinkedList<KeyValuePair<K,V>> GetLinkedList(int postion)
        {
            var l = items[postion];
            if (l == null)
            {
                l = new LinkedList<KeyValuePair<K, V>>();
                items[postion] = l;
            }
            return l;
        }
    }
}
