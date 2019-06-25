using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class VersionSorter : IComparer<string>
    {
        public int Compare(string v1, string v2)
        {
            if (v1 == null && v2 == null) return 0;
            if (v1 == null) return -1;
            if (v2 == null) return 1;
            if (v1 == v2) return 0;
            var v1splits = v1.Split(new string[1]{"."}, StringSplitOptions.RemoveEmptyEntries);
            var v2plits = v2.Split(new string[1] { "." }, StringSplitOptions.RemoveEmptyEntries);
            int i = 0;
            int j = 0;
            while (true)
            {
                if (i < v1splits.Length && j < v2plits.Length)
                {
                    if (Convert.ToInt32(v1splits[i]) == Convert.ToInt32(v2plits[j]))
                    {
                        i++;
                        j++;

                    }
                    else if (Convert.ToInt32(v1splits[i]) > Convert.ToInt32(v2plits[j])) return 1;
                    else return -1;
                }
                else if (i < v1splits.Length) return 1;
                else return -1;
            }

        }

        
    }

    public class VersionNumberSort
    {
        public static void MergeSort(string[] versions, int i , int j)
        {
            if (i >= j) return;
            int m = (i + j) / 2;
            MergeSort(versions, i, m );
            MergeSort(versions, m + 1, j);
            Merge(versions, i, m, j);
             
        }
        static void Merge(string[] versions , int p , int q , int r)
        {
            string[] left = new string[q - p + 1];
            string[] right = new string[r - q];
            Array.Copy(versions, p, left, 0, left.Length);
            Array.Copy(versions, q + 1, right, 0, right.Length);
            int i = 0;
            int j = 0;
            int k = p;
            var comparer = new VersionSorter();
            while(true)
            {
                if (i >= left.Length && j >= right.Length) break;
                if (i < left.Length && j < right.Length)
                {
                    if (comparer.Compare(left[i], right[j]) < 0)
                        versions[k++] = left[i++];
                    else versions[k++] = right[j++];
                }
                else if (i < left.Length) versions[k++] = left[i++];
                else versions[k++] = right[j++];
            }
        }
        public static void Sort(string[] versions)
        {
            Array.Sort(versions, new VersionSorter());
        }
        public static void Driver()
        {
            var input = new string[] { "1.0" , "2.0" , "1.1" , "2.1.3" , "2.1" , "3.1" , "2.3" , "3.1" };
            MergeSort(input , 0, input.Length - 1);
            //Sort(input);
            foreach (var s in input) Console.Write(s + " - ");
        }
    }
}
