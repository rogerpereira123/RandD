select 
datename(month,WeekBeginningDate) , max(TechCount)
from 
(select 
im.WeekBeginningDate,
COUNT(im.TechCode) as TechCount from 
tbl_InvoiceMaster im 
where im.WeekBeginningDate > '12/31/2009' and im.WeekBeginningDate < '01/01/2011' and im.WeekEndingDate < '01/01/2011'
and
im.InvoiceClassId in ('ME','M2' ,'M3','CD','CT','M4')
group by im.WeekBeginningDate 
) as Tech
group by datename(month,WeekBeginningDate),datepart(month,WeekBeginningDate)
order by datepart(month,WeekBeginningDate)

select 
datename(month,WeekBeginningDate) , max(TechCount)
from 
(select 
im.WeekBeginningDate,
COUNT(im.TechCode) as TechCount from 
tbl_HourlyInvoiceMaster im 
where im.WeekBeginningDate > '12/31/2009' and im.WeekBeginningDate < '01/01/2011' and im.WeekEndingDate < '01/01/2011'
and
im.InvoiceClassId not in ('ME','M2' ,'M3','CD','CT')
group by im.WeekBeginningDate 
) as Tech
group by datename(month,WeekBeginningDate),datepart(month,WeekBeginningDate)
order by datepart(month,WeekBeginningDate)





