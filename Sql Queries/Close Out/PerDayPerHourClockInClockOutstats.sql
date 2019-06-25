declare  @Startdate datetime
declare  @EndDate datetime
set @StartDate = '09/29/2010'
set @EndDate = DATEADD(day,6,@StartDate)



select
tjs.CSGLastChangedDate, datename(dw,tjs.CSGLastChangedDate) as 'Day' ,DATEPART(hour,w.Clock_In) 'AtHour', COUNT(w.WONumber) 'NumberOfJobsClockedIn',0 as 'NumberOfJobsClockedOut'
into #t
from
tbl_WOTimes w
inner join tbl_Data_Job_Setup tjs on w.WONumber = tjs.WONumber
where
tjs.CSGLastChangedDate >= @Startdate
and
tjs.CSGLastChangedDate <= @EndDate
group by  tjs.CSGLastChangedDate , datename(dw,tjs.CSGLastChangedDate), DATEPART(hour,w.Clock_In)
order by tjs.CSGLastChangedDate, DATEPART(hour,w.Clock_In)


select
tjs.CSGLastChangedDate, datename(dw,tjs.CSGLastChangedDate) as 'Day' ,DATEPART(hour,w.Clock_Out) 'AtHour', COUNT(w.WONumber) 'NumberOfJobsClockedOut'
into #t2
from
tbl_WOTimes w
inner join tbl_Data_Job_Setup tjs on w.WONumber = tjs.WONumber
where
tjs.CSGLastChangedDate >= @Startdate
and
tjs.CSGLastChangedDate <= @EndDate
and
w.Clock_Out is not null
group by  tjs.CSGLastChangedDate , datename(dw,tjs.CSGLastChangedDate), DATEPART(hour,w.Clock_Out)
order by tjs.CSGLastChangedDate, DATEPART(hour,w.Clock_Out)


update #t
set NumberOfJobsClockedOut = #t2.NumberOfJobsClockedOut
from #t2 
where
#t.CSGLastChangedDate = #t2.CSGLastChangedDate
and
#t.AtHour = #t2.AtHour

insert into #t
select 
#t2.CSGLastChangedDate, #t2.[DAY] ,#t2.AtHour,0 as NumberOfJobsClockedIn,  #t2.NumberOfJobsClockedOut
 from #t2 
left join #t on #t.CSGLastChangedDate = #t2.CSGLastChangedDate
and
#t.AtHour = #t2.AtHour
where
#t.AtHour is null

select
* from #t
order by CSGLastChangedDate,[DAY], AtHour

drop table #t
drop table #t2