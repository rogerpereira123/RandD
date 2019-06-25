using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Misc
{
    public class RemoveExtraSpacesFromASentece
    {
        public static string Remove(string sentence)
        {
            var A = sentence.ToCharArray();
            int j = 0;
            int sc = 1;
            for (int i = 0; i < A.Length; i++)
            {

                if (A[i] != ' ')
                {
                    A[j++] = A[i];
                    sc = 1;
                }
                else
                {
                    if (sc == 1)
                        A[j++] = ' ';
                    sc++;
                }
               
                
            }
            return new string(A , 0 , j);
        }
        public static void Driver()
        {
            var s = " This is       test     of                              space                         removal    ";
            Console.WriteLine(Remove(s));
        }
            
    }
}
