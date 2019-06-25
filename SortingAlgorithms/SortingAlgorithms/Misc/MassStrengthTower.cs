using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.Misc
{
    public class Person
    {
        public int Mass { get; set; }
        public int Strength { get; set; }
        public Person(int mass , int strength)
        {
            Mass = mass;
            Strength = strength;
        }

    }
    public class MassStrengthTower
    {
        int GetTotalMassOfTower(LinkedList<Person> tower)
        {
            return tower.Sum(p => p.Mass);
        }
        public int GetTowerHeight(List<Person> athletes)
        {
            athletes =  athletes.OrderBy(a => a.Mass).ToList();
            LinkedList<Person> Tower = new LinkedList<Person>();
            foreach (var a in athletes)
                if (GetTotalMassOfTower(Tower) <= a.Strength)
                    Tower.AddLast(a);
            return Tower.Count;
        }
    }
}
