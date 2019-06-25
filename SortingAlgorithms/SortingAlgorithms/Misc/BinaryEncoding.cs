using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Misc
{
    /*Problem Statement
    
    Let's say you have a binary string such as the following:
    011100011
    One way to encrypt this string is to add to each digit the sum of its adjacent digits. For example, the above string would become:
    123210122
     * In particular, if P is the original string, and Q is the encrypted string, then Q[i] = P[i-1] + P[i] + P[i+1] for all digit positions i. Characters off the left and right edges of the string are treated as zeroes.
     * Given a string message, containing the encrypted string, return a string[] with exactly two elements. The first element should contain the decrypted string assuming the first character is '0'; 
     * the second element should assume the first character is '1'. If one of the tests fails, return the string "NONE" in its place. For the above example, you should return {"011100011", "NONE"}.
     */
    public class BinaryEncoding
    {
        static string decode(string p, string Q)
        {
            
            for (var i = 1; i <= Q.Length - 1; i++)
            {
                if (i - 2 >= 0)
                {
                    var n = Convert.ToInt32(Q[i - 1].ToString()) - Convert.ToInt32(p[i - 2].ToString()) - Convert.ToInt32(p[i - 1].ToString());
                    if (n > 1 || n < 0)
                    {
                        p = "NONE";
                        
                        break;
                    }
                    p += n;
                }
                else if (i - 1 >= 0)
                {
                    var n = Convert.ToInt32(Q[i - 1].ToString()) - Convert.ToInt32(p[i - 1].ToString());
                    if (n > 1 || n < 0)
                    {
                        p = "NONE";
                        break;
                    }
                    p += n;
                }


            }
            return p;
        }
        public static string[] Decode(string Q)
        {
            List<string> result = new List<string>();
            result.Add(decode("0", Q));
            result.Add(decode("1", Q));
            return result.ToArray();
        }
    }
}
