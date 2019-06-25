using System.Linq;
namespace SortingAlgorithms.StringOperations
{
    public class Anagram
    {
        public static bool AreAnagrams(string s1, string s2)
        {
            if (s1 == null || s2 == null) return false;
            if (s1.Length != s2.Length) return false;
            var su1 = new string(s1.OrderBy(c => c).ToArray());
            var su2 = new string(s2.OrderBy(c => c).ToArray());
            return su1 == su2;
        }
    }
}
