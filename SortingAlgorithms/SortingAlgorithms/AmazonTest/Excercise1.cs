using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{

    class Excercise1
    {
        static string ConvertToBinary(string hex)
        {
            string s = "";
            for (int i = 0; i < hex.Length; i++)
                s += Convert.ToString(Convert.ToInt32(hex[i].ToString(), 16), 2).PadLeft(4, '0');
            return s;
        }
        static string[] ConvertString(string s)
        {
             var hex = s.Split(new char[1] { ' ' });
            List<string> result = new List<string>();
            //Time complexity O(n) where n is number of 2 character hex strings.
           // THe convertToBinary will execute in constant O(2) time and Replace will execute in O(8) time
           //THe space complexity is O(n) to store output array
            foreach(var h in hex)
            {
                var b = ConvertToBinary(h);
                b = b.Replace('1', 'x').Replace('0' , ' ');
                result.Add(b);
            }
            return result.ToArray();
        }
    }
}
