using System;
using System.Text;

namespace SortingAlgorithms.StringOperations
{
    public class RemoveDuplicateCharactersFromAString
    {
        public static string Distinct(string s)
        {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < s.Length; i++)
            {
                bool isAlreadyAdded = false;
                for (int j = 0; j < sb.Length; j++)
                {
                    if (s[i] == sb[j])
                    {
                        isAlreadyAdded = true;
                        break;
                    }
                }
                if (!isAlreadyAdded) sb.Append(s[i]);
            }
            return sb.ToString();
        }
        public static string DistinctFaster(string s)
        {
            var a = s.ToCharArray();
            int j = 0;
            for (int i = 1; i < a.Length; i++)
            {
                if (a[i] != a[i - 1])
                    a[++j] = a[i];
            }
            return new string(a , 0 , j+1);
        }
        public static void Driver()
        {
            var s = "aaa";
            Console.WriteLine(DistinctFaster(s));
        }
    }
}
