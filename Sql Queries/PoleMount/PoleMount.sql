declare @StartDate date = '03/26/2014'
declare @EndDate date = '04/08/2014'
select

  distinct tjs.WoNumber as OrgJob
from
tbl_Data_Job_Setup tjs 
inner join tbl_Data_Job_Setup pl on tjs.CustomerID = pl.CustomerID
inner join tbl_ZIPtoSupervisor zts on tjs.CustomerZip = zts.ZipCode
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
inner join tbl_TechtoSupervisor tts on tjs.TechCode = tts.TechCode
where
pl.ServiceCodes like '%2~%'
and
pl.WONumber <> tjs.WONumber
and
tjs.CSGLastChangedDate >= @Startdate
and
tjs.CSGLastChangedDate <= @EndDate
and tjs.CSGStatus in ('C', 'D')
and pl.CSGStatus in ('C', 'D' ,'O', 'R')
and
pl.SaleDate > tjs.CSGLastChangedDate

and
tjs.WorkorderType in ('NC' ,'RC' , 'RS')
/*group by datepart(wk , tjs.CSGLastChangedDate) - datepart(wk,dateadd(m, DATEDIFF(M, 0, tjs.CSGLastChangedDate), 0)) + 1
order by datepart(wk , tjs.CSGLastChangedDate) - datepart(wk,dateadd(m, DATEDIFF(M, 0, tjs.CSGLastChangedDate), 0)) + 1*/