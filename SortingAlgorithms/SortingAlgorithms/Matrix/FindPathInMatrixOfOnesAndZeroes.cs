using System;
using System.Collections.Generic;

public class FindPathInMatrixOfOnesAndZeroes
{
    struct Position
    {
        public int I { get; set; }
        public int J { get; set; }
    }
   
    static void FindPath(int[,] a,int n, int i, int j , string path, List<string> pathlist){
        path += string.Format("({0},{1})", i, j);
        if (i == n && j == n) pathlist.Add(path);
        else if (i >= a.GetLength(0) || j >= a.GetLength(1))
            return;
        else if (a[i, j] != 1) return;
        else
        {
            FindPath(a, n, i + 1, j, path, pathlist);
            FindPath(a, n, i, j + 1, path, pathlist);
        }
   
    }
    //Using dynamic programming find all the paths (the matrix contains only 1s or valid paths) from 0,0 to m,n...Just the count. 
    public int UniquePaths(int m, int n)
    {
        var c = new int[m, n];
        for (int i = 0; i < m; i++)
        {
            c[i, 0] = 1;

        }
        for (int i = 0; i < n; i++)
        {
            c[0, i] = 1;
        }
        for (int i = 1; i < m; i++)
        {
            for (int j = 1; j < n; j++)
            {
                c[i, j] = c[i - 1, j] + c[i, j - 1];
            }
        }
        return c[m - 1, n - 1];
    }
    public static void Driver()
    {
        int[,] a = new int[,] {
			{1,1,1},
			{1,0,1},
			{1,1,1}
		};
        var paths = new List<string>();
        FindPath(a , 2 , 0 , 0 , "" , paths);
        foreach (var p in paths)
            Console.WriteLine(p);
    }
}