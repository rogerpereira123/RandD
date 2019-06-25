using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.StringOperations
{
    public class Substring
    {
        public static bool IsSubstring(string s, string substr)
        {
            if (s.Length == 0) return false;
            if (substr.Length == 0) return false;
            
            int i = 0, j = 0;
            while (i < s.Length && j < substr.Length)
            {
                if (s[i] == substr[j])
                {
                    i++;
                    j++;
                    if (j == substr.Length ) return true;
                }
                else
                {
                    i = i - j; //i needs to be reset to its starting position for next comparison.
                    i++;
                    j = 0;
                }
            }
            return false;
        }
        
    }
}
