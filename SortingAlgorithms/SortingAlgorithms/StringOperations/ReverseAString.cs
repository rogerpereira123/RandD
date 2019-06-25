

using System;

namespace SortingAlgorithms.StringOperations
{
    public class ReverseAString
    {
        public static string Reverse(string s)
        {
            char[] sArray = s.ToCharArray();
            int start = 0, end = s.Length - 1;
            char temp;
            while (start < end)
            {
                if (sArray[start] != sArray[end])
                {
                    temp = sArray[start];
                    sArray[start] = sArray[end];
                    sArray[end] = temp;
                }
                start++;
                end--;
            }
            return new string(sArray);
        }
    }
}
