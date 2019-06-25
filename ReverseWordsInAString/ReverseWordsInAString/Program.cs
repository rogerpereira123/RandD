using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReverseWordsInAString
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Write("Enter inpute string: ");
            var input = Console.ReadLine();
            var output = Reverse(input);
            Console.WriteLine("Reversed Without Split: " +  output + " input length: " + input.Length + " output length: " + output.Length);
            output = ReverseWithSplit(input);
            Console.Write("Reversed With Split: " + output + " input length: " + input.Length + " output length: " + output.Length);

            Console.Read();
        }
        public static string Reverse(string inputString)
        {
           
            if (inputString == null || inputString.Length == 0)
                return string.Empty;
            int inputNextWordStartsAt = 0;
            char[] reveresedArray = new char[inputString.Length];
            int inputStringLength = inputString.Length;
        
            for(int i=0; i < inputString.Length; i++)
            {
                if(inputString[i] == ' ')
                {
                    Array.Copy(inputString.ToCharArray(), inputNextWordStartsAt, reveresedArray, inputStringLength - i, i - inputNextWordStartsAt);
                    reveresedArray[inputStringLength - i - 1] = ' ';
                    inputNextWordStartsAt = i + 1;

                }
                else if(i == inputString.Length - 1)
                {
                    Array.Copy(inputString.ToCharArray(), inputNextWordStartsAt, reveresedArray, 0, i - inputNextWordStartsAt + 1);
                }
            }
            return new string(reveresedArray);
        }
        public static string ReverseWithSplit(string inputString)
        {
            if (inputString == null || inputString.Length == 0)
                return string.Empty;

            string[] words = inputString.Split(new char[1] { ' ' });
            Stack<string> stack = new Stack<string>();
            for (int i = 0; i < words.Length; i++)
            {
                stack.Push(words[i]);
                if (i < words.Length - 1)
                    stack.Push(" ");
            }

            StringBuilder sb = new StringBuilder();
            while (stack.Count > 0) sb.Append(stack.Pop());
            return sb.ToString();

        }

    }
}
