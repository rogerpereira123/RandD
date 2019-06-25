using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Text.RegularExpressions;

namespace SortingAlgorithms
{
    public class Permutations
    {
        public static int runtime = 0;
        static void Swap(ref char a ,ref char b)
        {
            if (a == b) return;
            a ^= b;
            b ^= a;
            a ^= b;
            //var s = "kfgjf";
            
        }
        //There are length! permutations...,.O(n!)
        //T(n) = n * T(n-1) for all n > 1 which is n!
        //for n = 1 it is 1
        public static string[] AllPossiblePermutaionsOfAString(char[] s , int i)
        {
            
            List<string> result = new List<string>();
            if (i == s.Length - 1)
                result.Add(new string(s));
            for(int j = i ; j < s.Length; j++)
            {
               
                Swap(ref s[j] , ref s[i]);
                result.AddRange(AllPossiblePermutaionsOfAString(s, i + 1));
                Swap(ref s[j], ref s[i]);
            }
            return result.ToArray();
        }
        public static List<string> AllPossiblePermutaionsOfAString(string s)
        {
            if (s == null) return new List<string>();
            if (s.Length == 0) return new List<string>() { s };

            var first = s[0].ToString();
            var remianing = s.Substring(1);
            var substrings = AllPossiblePermutaionsOfAString(remianing);
            var result = new List<string>();
            foreach (var sub in substrings)
            {
                for (int i = 0; i <= sub.Length; i++)
                    result.Add(sub.Insert(i, first));
            }

            return result;
        }
    }

    
}
