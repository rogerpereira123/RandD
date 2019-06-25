


select
 
substring(convert(varchar(10) , timeclock.employeeid) , 2 , LEN(convert(varchar(10) , timeclock.employeeid))) as TechCode,
timeclock.TimeIn,
timeclock.TimeOut,
dateadd(HH,-5, timeclock.UTCDateModified) as DAteModified,
tts.Supervisor,
ttsSup.TechName as SupervisorName

from [milohsrv03\sqlexpress].[timeclockplus].[dbo].[employeehours] timeclock
inner join tbl_TechtoSupervisor tts on substring(convert(varchar(10) , timeclock.employeeid) , 2 , LEN(convert(varchar(10) , timeclock.employeeid))) = tts.TechCode
inner join tbl_TechtoSupervisor ttsSup on tts.Supervisor = ttsSup.TechCode
where
converT(datetime,convert(varchar(10),timeclock.TimeIn , 101),101) >= '06/23/2010'
and
converT(datetime,convert(varchar(10),timeclock.TimeOut , 101),101) <= '07/06/2010'
and
timeclock.utcDateModified > '07/14/2010'
and
timeclock.employeeid like '9%'




 
