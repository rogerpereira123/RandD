select 
convert(date,d1.CallDate) as [Date] , DATEPART(hour,d1.CallDate) as Hours, DATEPART(MINUTE,d1.CallDate) as Minutes ,COUNT(d1.LogId) as Requests
from tbl_DishWebServiceCallLog d1 
group by convert(date,d1.CallDate) , DATEPART(hour,d1.CallDate), DATEPART(MINUTE,d1.CallDate) having  COUNT(d1.LogId) >= 200
order by convert(date,d1.CallDate)



--select * from tbl_DishWebServiceCallLog where DATEPART(hour,CallDate) = 14 and DATEPART(MINUTE,CallDate) = 14  and convert(date,CallDate) = '08/20/2012'