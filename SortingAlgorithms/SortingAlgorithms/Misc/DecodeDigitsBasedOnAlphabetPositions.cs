using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Misc
{
    public class DecodeDigitsBasedOnAlphabetPositions
    {
         static Dictionary<string, long> memo;
        static Dictionary<string, string> Alphabets;
        static DecodeDigitsBasedOnAlphabetPositions()
        {
        	Alphabets = new Dictionary<string, string>();
            memo = new Dictionary<string, long>();
           
            for (var c = 'A'; c <= 'Z'; c++)
                Alphabets.Add((c - 64).ToString(), new String(c,1));


        }
         
        public long DecodeDigits(string digits)
        {
            
            if (digits.Length == 1)
                if (Alphabets.ContainsKey(digits[0].ToString()))
                    return 1;
                else return 0;
            var first = digits[0].ToString();
            var remaining = digits.Substring(1);
            long result = 0;

            if (Alphabets.ContainsKey(first))
            {
                long remainingCombinations;
                if (memo.ContainsKey(remaining))
                    remainingCombinations = memo[remaining];
                else
                {
                    remainingCombinations = DecodeDigits(remaining);
                    memo.Add(remaining, remainingCombinations);
                }
                result += remainingCombinations;
            }

            if (digits.Length == 2 && Alphabets.ContainsKey(digits[0].ToString() + digits[1].ToString()))
                result++;

            else if (digits.Length > 2 && Alphabets.ContainsKey(digits[0].ToString() + digits[1].ToString()))
            {
                first = digits[0].ToString() + digits[1].ToString();
                remaining = digits.Substring(2);
                long remainingCombinations;
                if (memo.ContainsKey(remaining))
                    remainingCombinations = memo[remaining];
                else
                {
                    remainingCombinations = DecodeDigits(remaining);
                    memo.Add(remaining, remainingCombinations);
                }
                result += remainingCombinations;

            }

            return result;
        }

    }
}
