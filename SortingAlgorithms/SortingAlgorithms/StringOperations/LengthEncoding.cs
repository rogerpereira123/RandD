using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.StringOperations
{
    class LengthEncoding
    {
        public static string Encode(string input)
        {
            if (input == null || input == string.Empty) return string.Empty;
            var result = new StringBuilder();
            int count = 1;
            for(int i = 0 ; i < input.Length; i++)
            {
                if (i + 1 < input.Length && input[i] == input[i + 1])
                    count++;
                else
                {
                    result.Append(input[i].ToString() + count);
                    count = 1;
                }
            }
            return result.ToString();


        }
        public static string Decode(string input)
        {
            if (input == null || input == string.Empty) return string.Empty;
            var result = new StringBuilder();
            for (int i = 0; i < input.Length; i = i + 2)
            {
                var repeatCount = Convert.ToInt32(input[i + 1].ToString());
                while (repeatCount-- > 0) result.Append(input[i]);
            }
            return result.ToString();
        }
    }
}
