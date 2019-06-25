using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.EvaluateExpressions
{
    
    public class Conversions
    {
        public Dictionary<string, int> Operators = new Dictionary<string, int>() { { "+", 0 }, { "-", 0 }, { "*", 1 }, { "/", 1 } };
        double PerformOperation(string op, double o1 , double o2)
        {
            double result = 0;
            switch(op)
            {
                case "+" :
                    result = o1 + o2;
                    break;
                case "-":
                    result = o1 - o2;
                    break;
                case "*":
                    result = o1 * o2;
                    break;
                case "/":
                    result = o1 / o2;
                    break;
            }
            return result;
        }

        public string ConvertInfixtoPostfixExpression(string exp, string delimiter)
        {
            if (exp == string.Empty) return string.Empty;
            var result = new StringBuilder();
            Stack<string> s = new Stack<string>();
            for(var i = 0 ; i < exp.Length; i++)
            {
                if(Operators.ContainsKey(exp[i].ToString()))
                {
                    if(!result.ToString().EndsWith(",")) result.Append(",");
                    while(s.Count> 0 && Operators.ContainsKey(s.Peek()) && Operators[s.Peek()] >= Operators[exp[i].ToString()])
                    {
                        result.Append(s.Pop() + delimiter);
                    }
                    s.Push(exp[i].ToString());
                }
                else if(exp[i].ToString() == "(")
                    s.Push(exp[i].ToString());
                else if(exp[i].ToString() == ")")
                {
                    if (!result.ToString().EndsWith(",")) result.Append(",");
                    while(s.Count > 0 && s.Peek() != "(")
                        result.Append(s.Pop() + delimiter);
                    s.Pop();
                }
                else result.Append(exp[i].ToString());
            }
            while (s.Count > 0) result.Append(s.Pop() + delimiter);
            return result.ToString();
        }
        public double EvaluatePostfixExpression(string postFix, string delimeter)
        {
            double result = 0.0;
            
            Stack<string> s = new Stack<string>();
            var str = "";
            for (var i = 0; i < postFix.Length; i++ )
            {
                if (postFix[i].ToString() != delimeter )
                {
                    str += postFix[i].ToString();
                    continue;
                }
                
                if (Operators.ContainsKey(str) && s.Count < 2) throw new Exception("The postfix expression is not valid");
                if (Operators.ContainsKey(str))
                {
                    var o2 = Convert.ToDouble(s.Pop());
                    var o1 = Convert.ToDouble(s.Pop());
                    var r = PerformOperation(str, o1, o2);
                    s.Push(r.ToString());
                }
                else
                    s.Push(str);

                str = string.Empty;
            }
            result = Convert.ToDouble(s.Pop());
            return result;
        }
        public string ConvertInfixToPrefix(string ex, string delimeter)
        {
            if (ex == string.Empty) return string.Empty;
            string sb = "";
            Stack<string> s = new Stack<string>();
            for (var i = ex.Length - 1; i >= 0; i-- )
            {
                if (Operators.ContainsKey(ex[i].ToString()))
                {
                    if(!sb.StartsWith(","))  sb = "," + sb;
                    while(s.Count > 0 && Operators.ContainsKey(s.Peek()) && Operators[s.Peek()] > Operators[ex[i].ToString()])
                        sb = delimeter + s.Pop() + sb;
                    s.Push(ex[i].ToString());
                }
                else if (ex[i].ToString() == ")")
                    s.Push(ex[i].ToString());
                else if(ex[i].ToString() == "(")
                {
                    if (!sb.StartsWith(",")) sb = "," + sb;
                    while(s.Peek() != ")")
                        sb = delimeter + s.Pop() + sb;
                    s.Pop();
                }
                else
                    sb = ex[i].ToString() +sb;
            }
            if (!sb.StartsWith(",")) sb = "," + sb;
            while (s.Count > 0) sb = delimeter + s.Pop() +sb;
            return sb.ToString();    
            
        }
        public double EvaluatePrefixExpression(string prefix , string delimeter)
        {
            if (prefix.Length == 0) return 0;
            Stack<string> stack = new Stack<string>();
            var splits = prefix.Split(new string[1] { delimeter }, StringSplitOptions.RemoveEmptyEntries);
            string s = "";
            for (var i = splits.Length - 1; i >= 0; i--)
            {

                s = splits[i];
                if (Operators.ContainsKey(s) && stack.Count < 2)
                    throw new Exception("Prefix expression is not valid");
                if (Operators.ContainsKey(s))
                {
                    var op1 = Convert.ToDouble(stack.Pop());
                    var op2 = Convert.ToDouble(stack.Pop());
                    var result = PerformOperation(s, op1, op2);
                    stack.Push(result.ToString());
                }
                else stack.Push(s);

                s = "";
            }
            var final = Convert.ToDouble(stack.Pop());
            return final;
        }
    }
}
