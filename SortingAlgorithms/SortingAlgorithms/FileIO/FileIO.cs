using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace SortingAlgorithms.FileIO
{
    class FileIO
    {
        public static void PrintLastNLinesOfAFile(string filePath , int n)
        {
            try
            {
                if(!File.Exists(filePath)) {
                    Console.WriteLine("File Not Found!");
                    return;
                }
                var lines = File.ReadLines(filePath);
                if(n > lines.Count())
                {
                    Console.WriteLine("There arent " + n + " lines in the flie.");
                    return;
                }
                Console.WriteLine("Printing last " + n + " lines:");
                var i = lines.Count() - 1;
                while(n-- > 0)
                    Console.WriteLine(lines.ElementAt(i--));

            }
            catch(IOException exp)
            {
                Console.WriteLine("There was an error:" + exp.Message);
            }
        }
        public static async Task<string> ReadContentsOfAFileAsync(string filePath)
        {
            using(var fs = new FileStream(filePath , FileMode.Open))
            {
                using(var sr = new StreamReader(fs))
                {
                    
                    var taskFileRead = sr.ReadToEndAsync();
                    Console.WriteLine("Reading file async");
                    var contents = await taskFileRead;
                    Console.WriteLine("Contents are ready. Length: " + contents.Length);
                    return contents;

                }
            }
        }
    }
}
