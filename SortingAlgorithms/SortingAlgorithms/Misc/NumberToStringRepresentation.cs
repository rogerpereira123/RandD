using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class NumberToStringRepresentation
    {

        
        static string getThreeOrLessDigitNumberToString(int num)
        {
            string[] basenumbers = new string[20] { "Zero", "One" , "Two" , "Three", "Four" , "Five" , "Six" , "Seven" , "Eight" , "Nine" , "Ten" , "Eleven" , "Twelve", "Thirteen" , "Fourteen" , "Fifteen" , "Sixteen" , "Seventeen" , "Eighteen" , "Nineteen"  };
            string[] tenth = new string[8] {"Twenty" , "Thirty" , "Fourty" , "Fifty" , "Sixty" , "Seventy" , "Eighty" , "Ninety" };
            string nstring = num.ToString();
            int nlength = nstring.Length;
            StringBuilder result= new StringBuilder();
            switch (nlength)
            { 
                case 1:
                    result.Append(basenumbers[num]);
                    break;
                case 2:
                    if (num < 20)
                        result.Append(basenumbers[num]);
                    else
                        result.Append(tenth[(num / 10) - 2] + (num % 10 > 0 ? " " + basenumbers[num%10] : ""));
                    break;
                case 3:
                    int div = num / 100;
                    int rem = num % 100;
                    result.Append(basenumbers[div]);
                    if (rem == 0)
                        result.Append(" Hundred");
                    else
                    {
                        result.Append(" Hundred & ");
                        if(rem < 20) result.Append(basenumbers[rem]);
                        else {
                            int rem1 = rem % 10;
                            result.Append(tenth[(rem / 10) - 2]);
                            if (rem1 > 0)
                                result.Append(" " + basenumbers[rem1]);
                        }

                    }
                    
                    break;
             }

            return result.ToString();

        }



        public static string getNumberToString(int num)
        {
            StringBuilder result = new StringBuilder();
            string nstring = num.ToString();
            int nlength = nstring.Length;
            if (nlength < 4) return getThreeOrLessDigitNumberToString(num);
            else if (nlength >= 4 && nlength <= 6)
                result.Append( getThreeOrLessDigitNumberToString(num/1000) + " Thousand " + (num %1000 == 0 ? "" : getThreeOrLessDigitNumberToString(num % 1000)));
            else 
            {
                if(nlength == 7) result.Append(getThreeOrLessDigitNumberToString(Convert.ToInt32(nstring[0].ToString())) + " Million ");
                else if (nlength == 8) result.Append(getThreeOrLessDigitNumberToString(Convert.ToInt32(nstring[0].ToString() + nstring[1].ToString())) + " Million ");
                else result.Append(getThreeOrLessDigitNumberToString(Convert.ToInt32(nstring[0].ToString() + nstring[1].ToString() + nstring[2].ToString())) + " Million ");

                result.Append((num % 1000000 > 999 ? getThreeOrLessDigitNumberToString((num % 1000000) / 1000) + " Thousand " : "") + (num % 1000 == 0 ? "" : getThreeOrLessDigitNumberToString(num % 1000)));
                


            }
            return result.ToString();
          

            
            
        }
    }
}
