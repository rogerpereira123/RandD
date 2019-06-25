declare @NoOfDaysToGoBack int
set @NoOfDaysToGoBack = 1
declare @CurrentUTCDatetime datetime
set @CurrentUTCDatetime = convert(varchar(10),getutcdate() ,101)
select @CurrentUTCDatetime + 1
select 
--Record Id
timeclock.RecordId,
--Tech Code
substring(convert(varchar(10) , timeclock.employeeid) , 2 , LEN(convert(varchar(10) , timeclock.employeeid))) as TechCode,  
--Date
CONVERT(varchar(10) , timeclock.TimeIn , 101),
--Start Time
convert(varchar(5) ,timeclock.TimeIn, 8),
--End Time
convert(varchar(5) ,timeclock.TimeOut, 8),
--Description,
'Added By TimeClock on ' + convert(varchar(50) , GETDATE(), 100)
from 
[milohsrv03\sqlexpress].[timeclockplus].[dbo].[employeehours] timeclock
where
timeclock.employeeid > 90000
and
timeclock.employeeid < 100000
and
timeclock.utcdatemodified >=  @CurrentUTCDatetime - @NoOfDaysToGoBack
and
timeclock.utcdatemodified < @CurrentUTCDatetime + 1
and
timeclock.timeout is not null
and
timeclock.timein is not null
and
converT(datetime,convert(varchar(10),timeclock.TimeIn , 101),101) > '02/09/2010'
order by TechCode
