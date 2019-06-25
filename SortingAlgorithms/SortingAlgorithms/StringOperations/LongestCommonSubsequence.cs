using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.StringOperations
{
    class LongestCommonSubsequence
    {
        static int[,] c;
        public static int GetLCSLength(string s1, string s2)
        {
            c = new int[s1.Length + 1, s2.Length + 1];
            for (var i = 1; i <= s1.Length; i++)
                for (var j = 1; j <= s2.Length; j++)
                    if (s1[i - 1] == s2[j - 1])
                        c[i, j] = c[i - 1, j - 1] + 1;
                    else c[i, j] = Math.Max(c[i, j - 1], c[i - 1, j]);
            return c[s1.Length, s2.Length];
        }
        public static string GetAnLCS(string s1, string s2)
        {
            GetLCSLength(s1, s2);
            return GetAnLCS(s1, s2, c, s1.Length, s2.Length);
        }
        static string GetAnLCS(string s1, string s2, int[,] c , int i, int j)
        {
            if (i == 0 || j == 0) return "";
            if (s1[i - 1] == s2[j - 1])
                return GetAnLCS(s1, s2, c, i - 1, j - 1) + s1[i-1];
            else
            {
                if (c[i - 1, j] > c[i, j - 1])
                    return GetAnLCS(s1, s2, c, i - 1, j);
                else return GetAnLCS(s1, s2, c, i, j - 1);
            }
        }

        public static List<string> GetAllLCS(string s1, string s2)
        {
            GetLCSLength(s1, s2);
            return GetAllLCS(s1, s2, c, s1.Length, s2.Length);
        }
        static List<string> GetAllLCS(string s1, string s2, int[,] c, int i, int j)
        {
            var result = new List<string>();
            if (i == 0 || j == 0) { result.Add(""); return result; }
            if (s1[i - 1] == s2[j - 1])
            {
              result =  GetAllLCS(s1, s2, c, i - 1, j - 1);
              for (int k = 0; k < result.Count; k++) result[k] = result[k] + s1[i - 1];
              return result;
            }
            else
            {
                if (c[i - 1, j] >= c[i, j - 1])
                    result = result.Union(GetAllLCS(s1, s2, c, i - 1, j)).ToList();
                if(c[i , j-1] >= c[i-1 , j]) 
                    result = result.Union(GetAllLCS(s1, s2, c, i, j - 1)).ToList();
                return result;
            }
           
        }
    }
}
