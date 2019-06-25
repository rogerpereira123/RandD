using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.StringOperations
{
    public class BinarySearchStringArrayWithEmptyStrings
    {
        
        public static int Find(string[] list , string v, int p, int q , int d)
        {
            if (list == null || list.Length == 0) return -1;
            if (p >= q) return -1;
            int m = (p + q) / 2;
            if (list[m] == v) return m;
            if(list[m] == string.Empty)
            {
                int mi = -1;
                //initial direction
                if(d == -1)
                {
                    var j = m;
                    while (j < list.Length && list[j] == string.Empty) j++;
                    if (j < list.Length) mi = j;
                    if(mi == -1)
                    {
                        j = m;
                        while (j >= 0 && list[j] == string.Empty) j--;
                        if (j >= 0) mi = j;
                    }
                    if (mi == -1) return mi;
                }
                else if(d == 1) //Go Right
                {
                    var j = m;
                    while (j < list.Length && list[j] == string.Empty) j++;
                    if (j < list.Length) mi = j;
                    if (mi == -1) return mi;
                    m = mi;
                }
                else //Go left
                {
                    var j = m;
                    while (j >= 0 && list[j] == string.Empty) j--;
                    if (j >= 0) mi = j;
                    if (mi == -1) return mi;
                    m = mi;
                }

            }
            var comp = list[m].CompareTo(v);
            if (comp == 0) return m;
            if (comp > 0) return Find(list, v, p, m - 1, 0);
            else return Find(list, v, m+1, q, 1);

        }
    }
}
