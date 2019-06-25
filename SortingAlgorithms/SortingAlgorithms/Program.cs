using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SortingAlgorithms.Misc;
using SortingAlgorithms.LinkedList;
using SortingAlgorithms.Graphs;
using SortingAlgorithms.HackerRank;
using SortingAlgorithms.MinimumSpanningTree;
using System.IO;
using SortingAlgorithms.StringOperations;
using SortingAlgorithms.FileIO;
using SortingAlgorithms.Trees;
using System.Numerics;
using SortingAlgorithms.SegmentTrees;
using SortingAlgorithms.Bitwise;


namespace SortingAlgorithms
{


    internal class Program
    {

     
        public static void Main()
        {

            FactorialTrailingZeroes.Driver();
            Console.ReadLine();
        }
    }

}

/*
Given the following table:
Temperature
   DayId INT (is sequential identity)
   Date   DATE
   Max_Temp DECIMAL

Find all the days where the max temperature is greater than the prior day.
Table contains exactly one row for each Date.

*/