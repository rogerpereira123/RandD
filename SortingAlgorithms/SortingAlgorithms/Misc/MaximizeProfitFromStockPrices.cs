using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class MaximizeProfitFromStockPrices
    {
        public static void MaximizeByBuyingAndSellingOneTime(int[] a)
        {
            if (a.Length == 0) return;
            int min = a[0];
            int finalMin = 0;
            int max = 0;
            int profit = 0;
            for (int i = 1; i < a.Length; i++)
            {
                if (a[i] - min > profit)
                {
                    profit =a[i] - min;
                    max = a[i];
                    finalMin = min;
                }
                if (a[i] < min) min = a[i];
            }
            Console.WriteLine("Single Time Min {0} Max {1} Profit {2}", finalMin, max, profit);
        }
        public struct Price
        {
            public int Min { get; set; }
            public int Max { get; set; }
            public int Profit { get { return Max - Min; } }
        }
        public static void MaximizeByBuyingSellingMulipleTimes(int[] a)
        {
            if (a.Length == 0) return;
            int min = a[0];
            int profit = 0;
            List<Price> p = new List<Price>();
            int localmax=0;
            int localmin = min;
            bool addFinalPrice = false;
            for (int i = 1; i < a.Length; i++)
            {
                if (a[i - 1] >= a[i])
                {
                    if(localmin < a[i-1])
                        p.Add(new Price()
                        {
                            Min = localmin,
                            Max = a[i-1]
                        });
                    min = a[i];
                    localmin = min;
                    addFinalPrice = false;
                }
                else
                {
                    profit += a[i] - min;
                    min = a[i];
                    localmax = a[i];
                    addFinalPrice = true;
                }
            }
            if (addFinalPrice) p.Add(new Price()
            {
                Min = localmin,
                Max = localmax
            });
            Console.WriteLine("Multiple Times Max Profit {0}", profit);
            foreach (var price in p)
                Console.WriteLine("Buy at {0} & Sell at {1} For Profit {2}", price.Min, price.Max, price.Profit);
        }
        public static void Driver()
        {
            int[] a = new int[] {20,5,4,17,8,10,11 , 12 , 11};
            MaximizeByBuyingAndSellingOneTime(a);
            MaximizeByBuyingSellingMulipleTimes(a);
        }
    }
}

