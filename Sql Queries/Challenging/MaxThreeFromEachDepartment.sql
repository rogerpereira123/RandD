/*
Write a SQL query to find employees who earn the top three salaries in each of the department. 

*/
declare @Employee table(Id int identity , Name varchar(200) , Salary float, DepartmentId int)
declare @Department table(Id int identity , Name varchar(200))
insert into @Department 
select 'IT'

insert into @Department 
select 'Sales'

insert into @Employee values('Joe' , 70000 , 1)
insert into @Employee values('Henry' , 80000 , 2)
insert into @Employee values('Sam' , 60000 , 2)
insert into @Employee values('Max' , 90000 , 1)
insert into @Employee values('Janet' , 69000 , 1)
insert into @Employee values('Randy' , 85000 , 1)

declare @t table(Id int identity, Department varchar(200) , Employee varchar(200) , Salary float)

insert into @t
select
d.Name , e.Name , e.Salary
from @Employee e 
inner join @Department d on e.DepartmentId = d.Id
order by d.Name asc , e.Salary desc ;

select 
t1.Department, t1.Employee , t1.Salary
from @t as t1, (select MIN(Id) as MinId, Department from @t group by Department) as t2 
where
t1.Id < (t2.MinId + 3)
and  t1.Department = t2.Department

------------------------------------------------------------------------------------------------
select 
data.Department,
data.Employee,
data.Salary
from (
select 
d.Name as Department,
e.Name as Employee, 
e.Salary ,
RANK() over ( partition by d.Name order by e.Salary desc) as SalaryRank
from @Employee e 
inner join @Department d on e.DepartmentId = d.Id) as data
where data.SalaryRank <= 3



