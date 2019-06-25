using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace SortingAlgorithms
{
    public class RunningThreadsInASequence
    {
        public static string RunThreadsInASequence()
        {
            StringBuilder sb = new StringBuilder();
            var tasks =  new List<Task>();
            object locker = new object();
            int sequence = 0;
            tasks.Add( new Task(() => {

                Thread.Sleep(5000);
                    sb.AppendLine("I executed first");

                    lock (locker) { sequence++; }
            }));
            tasks.Add(new Task(() => {

                while (sequence == 0)
                    Thread.Sleep(100);



                    Thread.Sleep(2000);
                    sb.AppendLine("I executed second");
                    lock (locker) { sequence++; }
                
            }));
            tasks.Add(new Task(() => {
                while (sequence < 2 )
                    Thread.Sleep(100);
                Thread.Sleep(2000);
                    sb.AppendLine("I executed third");
                    lock (locker) { sequence++; }
                
            }));

            tasks.ForEach(t => t.Start());
            Task.WaitAll(tasks.ToArray());

            return sb.ToString();


        }
        public static void RunThreadsInSequenceWithContinueWith()
        {
            var t = new Task(() => { Console.WriteLine("Thread 1"); });
            var u = t.ContinueWith((t1) => { Console.WriteLine("Thread 2"); });
            var v = u.ContinueWith((t2) => { Console.WriteLine("Thread 3"); });
            t.Start();
            v.Wait();
        }
    }
}
