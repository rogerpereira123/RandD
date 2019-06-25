select
case 
when month(CSGLastChangedDate) = 1 then 'Jan'
when month(CSGLastChangedDate) = 2 then 'Feb'
when month(CSGLastChangedDate) = 3 then 'March'
when month(CSGLastChangedDate) = 4 then 'April'
when month(CSGLastChangedDate) = 5 then 'May'
when month(CSGLastChangedDate) = 6 then 'June'
when month(CSGLastChangedDate) = 7 then 'July'
when month(CSGLastChangedDate) = 8 then 'Aug'
when month(CSGLastChangedDate) = 9 then 'Sept'
when month(CSGLastChangedDate) = 10 then 'Oct'
when month(CSGLastChangedDate) = 11 then 'Nov'
when month(CSGLastChangedDate) = 12 then 'Dec'
end, 
Count(distinct TechCode)
--COUNT(WONumber)
from tbl_Data_Job_Setup
where CSGLastChangedDate >= '01/01/2009'
and
CSGLastChangedDate <= '12/31/2009'
and
CSGStatus in ('C' , 'D')
and
TechCode in (select technumber from tbl_Data_Employees)
group by month(CSGLastChangedDate)
order by month(CSGLastChangedDate)


