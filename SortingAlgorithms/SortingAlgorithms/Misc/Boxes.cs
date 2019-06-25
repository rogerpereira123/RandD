using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    /*
     *  A large box can hold five items, while the small box can hold only one item. All items must be placed in boxes and used boxes have to be filled up completely.

Write a function that calculates the minimum number of boxes needed to hold a given number of items. If it's not possible to meet the requirements, return -1.

For example, if we have 12 products, 3 large and 3 small boxes, the function should return 4 (2 large boxes + 2 small boxes). */
    public class Boxes
    {
        public static int GetBoxesNeeded(int products, int availableLargeBoxes, int availableSmallBoxes)
        {
            if (availableLargeBoxes <= 0 && availableSmallBoxes <= 0) return -1;
            if (products == 0) return 0;
            int lg = 0;
            if (availableLargeBoxes > 0 && products > 0 && products >= 5)
            {
                int lgNeeded = products / 5;
                if (lgNeeded > availableLargeBoxes)
                    lg = availableLargeBoxes;
                else
                    lg =  lgNeeded;
                products = products - (5 * lg);
            }
            if (products == 0) return lg;
            int sm = 0;
            if (availableSmallBoxes > 0 && products > 0)
            {
                if (products > availableSmallBoxes) return -1;

                sm = products;
                products = 0;
            }
            if (products > 0) return -1;
            else return sm + lg;
        }
        public static void Driver()
        {
            Console.WriteLine("Enter items, large boxes and small boxes separated by space:");
            var s = Console.ReadLine().Split(new string[1]{" "} , StringSplitOptions.RemoveEmptyEntries);
            Console.WriteLine("Number of boxes needed: " + GetBoxesNeeded(Convert.ToInt32(s[0]) , Convert.ToInt32(s[1]) , Convert.ToInt32(s[2])));
        }
    }
}
