using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Misc
{
    public class WarehouseJob
    {
        public int TotalEfforts =0;
        public int[] stackBoxes(int[] boxes, string[] constraints)
        {
            List<int> AlreadyPlacedWeights = new List<int>();
            List<int> result = new List<int>();
            int max = 0;
            int indexOfMax = 0;
            Dictionary<int, List<int>> WeightToDepenedentWeights = new Dictionary<int, List<int>>();
            for(int i = 0 ; i < boxes.Length; i++)
            {
              
               
                if (constraints[i].Contains("1"))
                {
                    var c = constraints[i];
                    var dependentWeights = new List<int>();
                    for (int j = c.IndexOf("1"); j > -1; j = c.IndexOf("1", j + 1))
                        dependentWeights.Add(boxes[j]);
                    WeightToDepenedentWeights.Add(boxes[i], dependentWeights);
                }
                else
                    WeightToDepenedentWeights.Add(boxes[i], new List<int>());
               
            }
            while(WeightToDepenedentWeights.Count > 0)
            {
                var k = getWeightWithMaxEfforts(result, WeightToDepenedentWeights);
                process(k, result, WeightToDepenedentWeights, boxes);

            }

            return result.ToArray();

        }
        int getWeightWithMaxEfforts(List<int> result , Dictionary<int, List<int>> WeightToDepenedentWeights)
        {
            if (result.Count == 0) return WeightToDepenedentWeights.Keys.Max();
            var maxEfforts = 0;
            var keyWithMaxEfforts = 0;
            var h = (result.Count > 1 ? result.Count : 0);
            foreach(var key in WeightToDepenedentWeights.Keys)
                if((key * (result.Count + WeightToDepenedentWeights[key].Count) > maxEfforts))
                {
                    maxEfforts = key * (result.Count + WeightToDepenedentWeights[key].Count); 
                    keyWithMaxEfforts = key;
                }
            
            return keyWithMaxEfforts;
        }
        void process(int currentWeight, List<int> result , Dictionary<int, List<int>> WeightToDepenedentWeights , int[] boxes)
        {
            var dependents = WeightToDepenedentWeights[currentWeight] ;
            foreach (var v in dependents.OrderByDescending(t => t))
                if (WeightToDepenedentWeights.ContainsKey(v)) process(v, result, WeightToDepenedentWeights, boxes);
            TotalEfforts += (result.Count > 1 ? result.Count: 0) * currentWeight;
            result.Add(Array.IndexOf(boxes, currentWeight));
            WeightToDepenedentWeights.Remove(currentWeight);
           
        }
    }
}
