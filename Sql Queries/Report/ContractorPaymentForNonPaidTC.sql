select
sum(isnull((ilts.Count * m.value) , 0))
--distinct tjs2.WONumber
from
tbl_Data_Job_Setup tjs1 
inner join tbl_Data_Job_Setup tjs2 on tjs1.CustomerID = tjs2.CustomerID
left join tbl_InvoiceLine il on tjs2.WONumber = il.WONumber
left join tbl_InvoiceMaster im on il.InvoiceId = im.InvoiceId
left join tbl_InvoiceLineToServiceCode ilts on il.InvoiceLineId = ilts.InvoiceLineId
left join tbl_InvoiceServiceCodeMatrix m on ilts.InvoiceServiceCode = m.InvoiceServiceCode and m.InvoiceClassId = im.InvoiceClassId
where
tjs1.WONumber <> tjs2.WONumber
and
tjs1.CSGStatus in ('C' , 'D')
and
tjs2.WorkorderType in ('TC' , 'SC')
and
tjs2.CSGStatus in ('C' , 'D')
and
datediff(DAY ,tjs1.CSGLastChangedDate , tjs2.SaleDate) <= 60
and
datediff(DAY ,tjs1.CSGLastChangedDate , tjs2.SaleDate) > 0
and
tjs1.CSGLastChangedDate >= '03/01/2010'
and
tjs2.TechCode in (select TechCode from tbl_TechToPayrollClass where InvoiceClassId in ('M2' , 'M3' , 'ME' , 'CD' , 'CT'))
