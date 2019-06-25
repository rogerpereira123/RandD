using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms
{
    //A warning is generated fornot overriding object.GetHashCode if not overriden

    public struct P
    {
        int x;
        int y;
        public P(int x , int y)
        {
            this.x = x;
            this.y = y;

        }
        public static bool operator ==(P p1, P p2)
        {
            return (p1.x == p2.x) && (p1.y == p2.y);
        }
        public static bool operator !=(P p1, P p2)
        {
            return (p1.x != p2.x) || (p1.y != p2.y);
        }
        public override int GetHashCode()
        {
            return base.GetHashCode();
        }
    

    
    }
    public struct P1
    {
        string x;
        string y;
        public P1(string _x, string _y)
        {
            x = _x;
            y = _y;

        }



    }
    class HashingBasics
    {
        public static void Driver()
        {
            P p = new P(5, 6);
            P pO = new P(5, 6);
            Console.WriteLine("HashCodes: " + p.GetHashCode() + " " + pO.GetHashCode() + " Same? " + (p.GetHashCode() == pO.GetHashCode()));
            P1 p1p = new P1("5", "abc");
            P1 p2p = new P1("5", "a");
            Console.WriteLine("HashCodes: " + p1p.GetHashCode() + " " + p2p.GetHashCode() + " Same? " + (p1p.GetHashCode() == p2p.GetHashCode()));
        }
    }
}
