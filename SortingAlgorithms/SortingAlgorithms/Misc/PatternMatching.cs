using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Misc
{
    public class PatternMatching
    {
        /// <summary>
        /// Returns number of times the given pattern appears in the input string s.
        /// </summary>
        /// <param name="s">Input string </param>
        /// <param name="p">Pattern to match</param>
        /// <returns></returns>
        public static int Match(string s, string p)
        {
            int result = 0;
            int i = 0 ;
            while((i = s.IndexOf(p , i)) != -1)
            {
                i += p.Length;
                result++;
            }
            return result;


        }
    }
}
