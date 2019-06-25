using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.LinkedList
{
    public class AddLinkedLists
    {
        /// <summary>
        /// Add two linked lists where numbers are represented from left to right (rightmost digit being unit's place)
        /// </summary>
        /// <param name="n1">SinglyLinkedListNode</param>
        /// <param name="n2">SinglyLinkedListNode</param>
        /// <returns>SinglyLinkedListNode</returns>
        public static SinglyLinkedListNode<int> Add(SinglyLinkedListNode<int> n1, SinglyLinkedListNode<int> n2)
        {
            if (n1 == null) return n2;
            if (n2 == null) return n1;
            var sn1 = new Stack<int>();
            var sn2 = new Stack<int>();
            var c = n1;
            while(c!= null)
            {
                sn1.Push(c.Data);
                c = c.Next;
            }
            c = n2;
            while(c != null)
            {
                sn2.Push(c.Data);
                c = c.Next;
            }
            SinglyLinkedListNode<int> next = null;
            SinglyLinkedListNode<int> head = null;
            int carry = 0;
            while(true)
            {
                if(sn1.Count == 0 && sn2.Count == 0)
                {
                    if (carry == 0) head = next;
                    else
                    {
                        var newNode = new SinglyLinkedListNode<int>() { Data = carry , Next = next };
                        head = newNode;
                    }
                    break;
                }
                else if(sn1.Count == 0)
                {
                    var sum = sn2.Pop() + carry;
                    var newNode = new SinglyLinkedListNode<int>() { Data = sum % 10, Next = next };
                    carry = sum / 10;
                     next = newNode;
                   
                }
                else if (sn2.Count == 0)
                {
                    var sum = sn1.Pop() + carry;
                    var newNode = new SinglyLinkedListNode<int>() { Data = sum % 10, Next = next };
                    carry = sum / 10;
                    next = newNode;
                }
                else
                {
                    var sum = sn1.Pop()+ sn2.Pop() + carry;
                    var newNode = new SinglyLinkedListNode<int>() { Data = sum % 10, Next = next };
                    carry = sum / 10;
                    next = newNode;
                }

            }
            return head;
        }
        /// <summary>
        /// Add two linked list where numbers are represented from right to left (leftmost digit being unit's place)
        /// </summary>
        /// <param name="n1">SinglyLinkedListNode</param>
        /// <param name="n2">SinglyLinkedListNode</param>
        /// <returns>SinglyLinkedListNode</returns>
        public static SinglyLinkedListNode<int> AddLeftToRight(SinglyLinkedListNode<int> n1 , SinglyLinkedListNode<int> n2)
        {
            if (n1 == null) return n2;
            if (n2 == null) return n1;
            SinglyLinkedListNode<int> next = null;
            int carry = 0;
            SinglyLinkedListNode<int> result = null;
            SinglyLinkedListNode<int> cn1 = n1;
            SinglyLinkedListNode<int> cn2 = n2;
            while(true)
            {
                if(cn1 == null && cn2 == null)
                {
                    if(carry > 0)
                    {
                        next.Next = new SinglyLinkedListNode<int>() {
                            Data = carry
                        };
                    }
                    break;
                }
                else if(cn1 == null)
                {
                    var sum = cn2.Data + carry;
                    next.Next = new SinglyLinkedListNode<int>()
                    {
                        Data = sum % 10
                    };
                    carry = sum / 10;
                    cn2 = cn2.Next;
                    next = next.Next;
                }
                else if (cn2 == null)
                {
                    var sum = cn1.Data + carry;
                    next.Next = new SinglyLinkedListNode<int>()
                    {
                        Data = sum % 10
                    };
                    carry = sum / 10;
                    cn1 = cn1.Next;
                    next = next.Next;
                }
                else
                {
                    var sum = cn1.Data + cn2.Data + carry;
                    if (next == null)
                    {
                        next = new SinglyLinkedListNode<int>() { Data = sum % 10 };
                        result = next;
                    }
                    else
                    {
                        next.Next = new SinglyLinkedListNode<int>()
                        {
                            Data = sum % 10
                        };
                        next = next.Next;
                    }
                    carry = sum / 10;
                    cn1 = cn1.Next;
                    cn2 = cn2.Next;
                }

            }
            return result;
        }
        public static void Driver()
        {
            var n1 = new SinglyLinkedListNode<int>()
            {
                Data = 9,
                Next = new SinglyLinkedListNode<int>() { 
                    Data = 9,
                    Next = new SinglyLinkedListNode<int>()
                    {
                        Data = 9
                    }
                }
            };

            var n2 = new SinglyLinkedListNode<int>()
            {
                Data = 1,
                Next = new SinglyLinkedListNode<int>()
                {
                    Data = 1
                }
            };

            var r = AddLeftToRight(n1, n2);
            var c= n1;
            while (c != null)
            {
                Console.Write(c.Data + " ");
                c = c.Next;
            }
            Console.WriteLine(" +");
            c = n2;
            while (c != null)
            {
                Console.Write(c.Data + " ");
                c = c.Next;
            }
            Console.WriteLine(" =");
            c = r;
            while (c != null)
            {
                Console.Write(c.Data + " ");
                c = c.Next;
            }

        }
    }
}
