using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.LinkedList
{
    /*
     Given 1->2->3->3->4->4->5, return 1->2->5.
Given 1->1->1->2->3, return 2->3.
     * 
     */
    public class ListNode {
     public int val;
      public ListNode next;
      public ListNode(int x) { val = x; }
  }
    class RemoveDuplicatesFromSorteLinkedList
    {
        public ListNode DeleteDuplicates(ListNode head)
        {
            if (head == null) return head;
            Dictionary<int, int> d = new Dictionary<int, int>();
            var prev = head;
            var next = head.next;
            d.Add(head.val, 1);
            while (next != null)
            {
                if (d.ContainsKey(next.val))
                {
                    d[next.val]++;
                    if (prev == head) head = next.next;
                    prev.next = next.next; ;
                    next = next.next;
                }
                else
                {
                    d.Add(next.val, 1);
                    prev = next;
                    next = next.next;
                }

            }
            next = head;
            prev = head;
            while (next != null)
            {
                if (d.ContainsKey(next.val) && d[next.val] > 1)
                {
                    if (next == head) head = next.next;
                    prev.next = next.next;
                    next = next.next;
                }
                else
                {
                    prev = next;
                    next = next.next;

                }

            }

            return head;
        }
    }
}
