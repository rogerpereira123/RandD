select him.TechCode , Sum(isnull(tjs.WorkUnits , 0)) + sum(isnull(iwo.Points , 0)) as Points
from tbl_HourlyInvoiceLine hil inner join tbl_HourlyInvoiceMaster him on hil.InvoiceId = him.InvoiceId
left join tbl_data_job_setup tjs on hil.WoNumber =tjs.WONumber
left join internalworkorder iwo on hil.WoNumber =iwo.WONumber

where
(him.WeekBeginningDate = '01/06/2010'
or
him.WeekEndingDate ='01/19/2010')
group by him.TechCode 
order by Points desc