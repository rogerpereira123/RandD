using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Collections;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class FirstNonRepeatedCharacterInAString
    {
        //Running time O(n^2)
        public static char GetFirstNonRepeatedCharacterInAString(string s)
        {
            char c = default(char);
            if(s == null || s.Length == 0) return c;
            bool isFound = true;
            int i;
            for(i =0 ; i < s.Length; i++)
            {
                isFound = true;
                for(int j = 0; j < s.Length; j++)
                {
                    if (i == j) continue;
                    if (s[i] == s[j])
                    {
                        isFound = false;
                        break;
                    }

                }
                if (isFound) break;
            }
            if (isFound) c = s[i];
            return c;

        }
        //Running Time O(n)
        public static char GetFirsrNonrepeatedCharacterInAStringFaster(string s)
        {
            char c = default(char);
            if (s == null || s.Length == 0) return c;
            Dictionary<char, bool> d = new Dictionary<char, bool>();
            for (int i = 0; i < s.Length; i++ )
                if(d.ContainsKey(s[i])) d.Remove(s[i]);
                else d.Add(s[i] , true);
            if (d.Count > 0)
                c = d.ElementAt(0).Key;
           return c;


            
        }
    }
}
