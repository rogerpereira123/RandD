
using System;
using System.Threading;


namespace SortingAlgorithms.Misc
{
    public class Rectangle
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int W { get; set; }
        public int H { get; set; }

        public override string ToString()
        {
            return "(X,Y) : (" + X + "," + Y + ") H: " + H + " & W : " + W;

        }
    }
    public class IntersectingRectangles
    {
        public static Rectangle GetInstersection(Rectangle r1, Rectangle r2)
        {
            if (r1 == null || r2 == null) return null;
            int xResult = -1, yResult = -1, hResult = -1, wResult = -1;
            
            if (r2.X >= r1.X && r2.X <= r1.X + r1.W) xResult = r2.X;
            else if (r2.X + r2.W >= r1.X && r2.X + r2.W <= r1.X + r1.W)
            {
                xResult = r2.X >= r1.X ? r2.X : r1.X;
            }
             if (r2.Y >= r1.Y && r2.Y <= r1.Y + r1.H) yResult = r2.Y;
            else if (r2.Y + r2.H >= r1.Y && r2.Y + r2.H <= r1.Y + r1.H)
            {
                yResult = r2.Y >= r1.Y ? r2.Y : r1.Y;
                
            }
            //Check if the r2 is completely inside r1
            if (r2.X >= r1.X && r2.X + r2.W <= r1.X + r1.W && r2.Y >= r1.Y && r2.Y + r2.H <= r1.Y + r1.H)
            {
                hResult = r2.H;
                wResult = r2.W;
            }
            else
            {
                hResult = r1.H - r2.H;
                wResult = r1.W - r2.W;
                hResult = (hResult < 0 ? hResult*-1 : hResult);
                wResult = (wResult < 0 ? wResult*-1 : wResult);
            }
                
            if(xResult == -1 || yResult == -1) return new Rectangle();

            return new Rectangle() { X = xResult , Y = yResult , H =  hResult, W = wResult};

        }
    }
}
