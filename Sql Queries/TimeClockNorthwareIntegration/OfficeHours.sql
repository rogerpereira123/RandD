--select timein,timeout,breakflag,timeout-timein
select employeeid, sum(datepart(hour,timeout-timein)) + round(sum(datepart(minute , timeout -timein)) / 60.0,2),sum(datepart(hour,timeout-timein)), sum(datepart(minute , timeout -timein))
from [milohsrv03\sqlexpress].[timeclockplus].[dbo].[employeehours] timeclock1
where
TimeClock1.TimeIn > '03/21/2010'
and
TimeClock1.TimeOut < convert(datetime ,'03/27/2010' ,101) + 1
and EMployeeid = '82527'
group by employeeid

