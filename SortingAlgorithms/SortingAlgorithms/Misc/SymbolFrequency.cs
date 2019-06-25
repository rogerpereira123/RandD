using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Misc
{
    public class SymbolFrequency
    {
        double getDeviation(string f , string text)
        {
            Dictionary<string, double> fd = new Dictionary<string, double>();
            for(var i = 0; i < f.Length; i+=3)
                fd.Add(f[i].ToString(), Convert.ToDouble(f[i + 1].ToString() + f[i + 2].ToString()));
            text = text.Replace(" ", "").Replace("\r", "").Replace("\n", "").Replace("\t", "");
            double expectedCount = 0.0;
            double actualCount = 0.0;
            double deviation = 0.0;
            foreach(var l in fd.Keys)
            {
                expectedCount = Math.Round( (fd[l] / 100) * text.Length , 4);
                actualCount = text.Count(c => c == l[0]);
                deviation += Math.Round( Math.Pow(expectedCount - actualCount, 2) , 4);
            }
            var notInFrequencyTable = text.Where(c => !fd.Keys.Contains(c.ToString()));
            foreach (var c in notInFrequencyTable)
                deviation += Math.Pow(notInFrequencyTable.Count(c1 => c1 == c), 2);
            return deviation;

            
        }
        public double language(string[] frequencies, string[] text)
        {
            List<double> deviations = new List<double>();
            string s = String.Concat(text);
            foreach (var f in frequencies)
                deviations.Add(getDeviation(f, s));
            return deviations.Min();
        }
    }
}
