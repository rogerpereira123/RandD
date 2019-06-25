using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.Collections.Concurrent;

namespace SortingAlgorithms
{
    /*
     * Write a consumer producer problem. Producer produces 1000 objects and there are five consumers that consume 10 objects at a time in round robin fashion 
     * until all of them are consumed. This means that if consumer 1 consumes 10 objects, it has to wait for consumer 2, 3, 4, 5 to consume 10 objects 
     * each before it can consume other 10.  */
    public class ProducerConsumer
    {
        static ConcurrentQueue<string> q = new ConcurrentQueue<string>();
        static int executioncount = 0;
        static readonly object locker = new object();
        public static void Run()
        {
            var producer = new Task(() =>
            {
                for (int i = 0; i < 50; i++)
                    q.Enqueue(i.ToString());
            });
            var consumer1 = new Task(() =>
            {
                while (q.Count > 0)
                {
                    while (executioncount != 0) Thread.Sleep(100);
                    if (q.Count == 0) return;
                    Console.WriteLine("Consumer1");
                    for (int i = 0; i < 10; i++)
                    {
                        var num = "";
                        q.TryDequeue(out num);
                  
                        Console.WriteLine(num);
                    }
                    lock (locker)
                    {
                        executioncount++;
                    }
                }
            });
            var consumer2 = new Task(() =>
            {
                while (q.Count > 0)
                {
                    while (executioncount != 1) Thread.Sleep(100);
                    if (q.Count == 0) return;
                    Console.WriteLine("Consumer2");
                    for (int i = 0; i < 10; i++)
                    {
                        var num = "";
                        q.TryDequeue(out num);
                        
                        Console.WriteLine(num);
                    }
                    lock (locker)
                    {
                        executioncount++;
                    }
                }
            });
            var consumer3 = new Task(() =>
            {
                while (q.Count > 0)
                {
                    while (executioncount != 2) Thread.Sleep(100);
                    if (q.Count == 0) return;
                    Console.WriteLine("Consumer3");
                    for (int i = 0; i < 10; i++)
                    {
                        var num = "";
                        q.TryDequeue(out num);
                       
                        Console.WriteLine(num);
                    }
                    lock (locker)
                    {
                        executioncount++;
                    }
                }
            });
            var consumer4 = new Task(() =>
            {
                while (q.Count > 0)
                {
                    while (executioncount != 3) Thread.Sleep(100);
                    if (q.Count == 0) return;
                    Console.WriteLine("Consumer4");
                    for (int i = 0; i < 10; i++)
                    {
                        var num = "";
                        q.TryDequeue(out num);
                        
                        Console.WriteLine(num);
                    }
                    lock (locker)
                    {
                        executioncount++;
                    }
                }
            });
            var consumer5 = new Task(() =>
            {
                while (q.Count > 0)
                {
                    while (executioncount != 4) Thread.Sleep(100);
                    if (q.Count == 0) return;
                    Console.WriteLine("Consumer5");
                    for (int i = 0; i < 10; i++)
                    {
                        var num = "";
                        q.TryDequeue(out num);
                     
                        Console.WriteLine(num);
                    }
                    lock (locker)
                    {
                        executioncount = 0;
                    }
                }
            });
            producer.Start();
            producer.Wait();

            consumer1.Start();
            consumer2.Start();
            consumer3.Start();
            consumer4.Start();
            consumer5.Start();
            consumer5.Wait();


        }

        public static void Driver()
        {
            Run();
        }
    }
}
