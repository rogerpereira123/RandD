using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections;

namespace SortingAlgorithms.Misc
{
    public class WordCloud
    {
        public static Hashtable GetWordCloud(string s)
        {
            Hashtable ht = new Hashtable();
            string punctuations = "\":,;!'.-)( ";
            int wordStartingIndex = 0;
            for (int i = 0; i < s.Length; i++ )
            {
                var w = "";
                if(punctuations.Contains(s[i]))
                {
                    w = s.Substring(wordStartingIndex , i - wordStartingIndex).ToLower().Trim();
                    wordStartingIndex += i - wordStartingIndex + 1;
                    if (w == string.Empty) continue;
                    if (ht.ContainsKey(w))
                        ht[w] = Convert.ToInt32(ht[w]) + 1;
                    else ht.Add(w, 1);
                }
                
                   
            }

            return ht;
        }
    }
}
