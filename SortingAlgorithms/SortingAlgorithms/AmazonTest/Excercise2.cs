using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SortingAlgorithms.AmazonTest
{
    class Student
    {
        string grade;
        public int Rank { get; set; }
        public string Name { get; set; }
        public List<int> Scores { get; set; }
        public double Average
        {
            get
            {
                return Math.Ceiling(Math.Round(Scores.Sum() / 5.0, 2));
            }
        }

        public string Grade
        {
            get
            {
                return grade;
            }
            set
            {
                grade = value;
            }
        }
        public void EvaulateGrade()
        {
            var avg = Average;
            if (avg >= 90) grade = "A";
            else if (avg >= 80) grade = "B";
            else if (avg >= 70) grade = "C";
            else if (avg >= 60) grade = "D";
            else grade = "F";
        }
        public string ToString()
        {
            var s = Name + ", " + Average + ", " + Grade + ": ";
            int count = 0;
            foreach (var score in Scores)
            {
                if (count == Scores.Count - 1) s += score;
                else s += score + ", ";
                count++;
            }
            return s;
        }
        public Student()
        {
            Name = string.Empty;
            Scores = new List<int>() { 0, 0, 0, 0, 0 };
        }
    }
    class Excercise2
    {
        public static void DriverProgram()
        {
            var s = new string[] { "Baz, Quux, 90, 90, 90, 90" };
            int threePercentileOfTotalStudents = Convert.ToInt32(Math.Ceiling(s.Length * 0.03));
            List<Student> Students = new List<Student>();
            foreach (var sc in s)
            {
                var scores = sc.Split(new char[1] { ',' });
                var stu = new Student()
                {
                    Name = scores[0] + ", " + scores[1]
                };
                stu.Scores.Clear();
                for (var i = 2; i < scores.Length; i++)
                    stu.Scores.Add(Convert.ToInt32(scores[i].Trim()));
                for (var i = 5 - scores.Length; i < 0; i--) stu.Scores.Add(0);
                stu.EvaulateGrade();
                Students.Add(stu);

            }

            int rank = 1;
            int cnt = threePercentileOfTotalStudents;
            foreach (var st in Students.OrderByDescending(stud => stud.Average))
            {
                st.Rank = rank;
                if (st.Rank <= threePercentileOfTotalStudents) if (st.Grade != "A" || st.Grade != "F") st.Grade += "+";
                if (st.Rank >= Students.Count - threePercentileOfTotalStudents)
                    if (st.Grade != "F")
                    {
                        st.Grade = st.Grade.Replace("+", "");
                        st.Grade += "-";
                    }
                rank++;

            }
            /* foreach (var st in Students.Where(stud => stud.Rank <= threePercentileOfTotalStudents))
             {
                 if(st.Grade == "A" || st.Grade =="F") continue;
                 st.Grade += "+";
             }
             int cnt=  threePercentileOfTotalStudents;
             foreach(var st in Students.OrderByDescending(stud => stud.Rank))
             {
                 if(cnt <= 0) break;
                 if(st.Grade == "F") continue;
                 st.Grade = st.Grade.Replace("+", "");
                 st.Grade += "-";
                 cnt--;
             }
             */
            List<string> result = new List<string>();
            foreach (var stud in Students.OrderBy(st => st.Average))
                result.Add(stud.ToString());

            Console.Read();
        }
    }
}
