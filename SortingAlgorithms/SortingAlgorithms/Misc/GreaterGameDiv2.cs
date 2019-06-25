using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    public class GreaterGameDiv2
    {
        public int calc(int[] snuke, int[] sothe)
        {
            int result = 0;
            for (int i = 0; i < snuke.Length; i++)
                if (snuke[i] > sothe[i]) result++;

            return result;

        }
    }
    public class PathGameDiv2
    {
        public int calc(string[] board)
        {
            int result = 0;
            Dictionary<int, int> path = new Dictionary<int, int>();
            var l = board[0].Length;

            if (board[0][0] == '.')
            {
                path.Add(0, 0);
                for (int j = 1; j < l; j++)
                    if (board[0][j] == '.')
                        path.Add(0, j);
                    else if (board[1][0] == '.')
                        path.Add(1, j);
            }
            else if(board[1][0] == '.')
            {
                path.Add(1, 0);
                for (int j = 1; j < l; j++)
                    if (board[1][j] == '.')
                        path.Add(1, j);
            }

            return result;
        }
    }
}
