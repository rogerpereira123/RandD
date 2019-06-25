using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.LinkedList
{
    public class LRUCache
    {
        Dictionary<int, LinkedListNode<KeyValuePair<int, int>>> d;
        LinkedList<KeyValuePair<int, int>> list;
        int size;
        public LRUCache(int capacity)
        {
            d = new Dictionary<int, LinkedListNode<KeyValuePair<int, int>>>(capacity);
            size = capacity;
            list = new LinkedList<KeyValuePair<int, int>>();
        }

        public int Get(int key)
        {
            if (!d.ContainsKey(key)) return -1;
            var node = d[key];
            var result = node.Value.Value;
            list.Remove(node);
            list.AddLast(node);
            return result;

        }

        public void Set(int key, int value)
        {
            if (d.ContainsKey(key))
            {
                var node = d[key];
                list.Remove(node);
                node.Value = new KeyValuePair<int, int>(key, value);
                list.AddLast(node);
                d[key] = node;
            }
            else
            {
                var newNode = new LinkedListNode<KeyValuePair<int, int>>(new KeyValuePair<int, int>(key, value));
                if (d.Count == size)
                {
                    var nodeToRemove = list.First();
                    list.Remove(nodeToRemove);
                    d.Remove(nodeToRemove.Key);
                }

                list.AddLast(newNode);
                d.Add(key, newNode);
            }

        }
    }
}
