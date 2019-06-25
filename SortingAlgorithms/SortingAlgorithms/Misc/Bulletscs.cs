using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Misc
{
    public class Bullets
    {
        public int match(string[] guns, string bullet)
        {
            int index = -1;
            var matches  = guns.Where(g => (bullet + bullet).Contains(g));
            if (matches.Count() > 0) index = Array.IndexOf(guns, matches.ElementAt(0));
            return index;
        }
    }
}
