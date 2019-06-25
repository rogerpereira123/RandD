using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace SortingAlgorithms
{
    public class Deadlock
    {
        static readonly object x = new object();
        static readonly object y = new object();
        public static void CreateDeadlock()
        {
            var t1 = new Task(() => {
                lock(x)
                {
                    Thread.Sleep(2000);
                    Console.WriteLine("Thread 1 locked x");
                   
                    lock(y)
                    {
                        Console.WriteLine("Thread 1 locked y");
                    }
                }
            });
            var t2 = new Task(() => {
                lock (y)
                {
                    Thread.Sleep(2000);
                    Console.WriteLine("Thread 2 locked x");
                    lock (x)
                    {
                        Console.WriteLine("Thread 2 locked y");
                    }
                }
            });
            t1.Start();
            t2.Start();
        }
        public static void LockInRecursiveMethod()
        {
            Console.WriteLine("In LockInRecursiveMethod:");
            lock (x)
            {
                Thread.Sleep(2000);
                Console.WriteLine("X Locked:");
                var t = new Thread(LockInRecursiveMethod);
                t.Start();
            }
        }
    }
}
