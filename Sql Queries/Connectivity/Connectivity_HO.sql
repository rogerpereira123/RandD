select
HO.WONumber ,iwo.TechCode as CompletedBy,iwo.LastupdatedDt as ClosedDate,ilts.InvoiceServiceCode,(iscm.value * ilts.Count) as AmountPaid, tts.TechName ,ttsSup.Supervisor,ttsSup.TechName as SupervisorName,tdc.NAME as CustomerName, tdc.ADDRESS,tdc.PHONE
into #t
--SUM((iscm.value * ilts.Count))
from
HO
inner join InternalWorkOrder iwo on ho.WONumber = iwo.WONumber
inner join tbl_data_customers tdc on iwo.CustomerID =  tdc.CUSTOMERID
inner join tbl_TechtoSupervisor tts on iwo.TechCode = tts.TechCode
inner join tbl_TechtoSupervisor ttsSup on tts.Supervisor = ttsSup.TechCode
inner join tbl_InvoiceLine il on iwo.WONumber = il.WONumber
inner join tbl_InvoiceMaster im on il.InvoiceId = im.InvoiceId
inner join tbl_InvoiceLineToServiceCode ilts on il.InvoiceLineId = ilts.InvoiceLineId
inner join tbl_InvoiceServiceCodeMatrix iscm on ilts.InvoiceServiceCode = iscm.InvoiceServiceCode and im.InvoiceClassId = iscm.InvoiceClassId



select
HO.WONumber ,iwo.TechCode as CompletedBy,iwo.LastupdatedDt as ClosedDate,0 as AmountPaid, tts.TechName ,ttsSup.Supervisor,ttsSup.TechName as SupervisorName,tdc.NAME as CustomerName, tdc.ADDRESS,tdc.PHONE
into #result
from
HO
inner join InternalWorkOrder iwo on ho.WONumber = iwo.WONumber
inner join tbl_data_customers tdc on iwo.CustomerID =  tdc.CUSTOMERID
inner join tbl_TechtoSupervisor tts on iwo.TechCode = tts.TechCode
inner join tbl_TechtoSupervisor ttsSup on tts.Supervisor = ttsSup.TechCode
left join #t on HO.WONumber = #t.wonumber
where
#t.wonumber is null
and
iwo.TechCode in (select TechCode from tbl_TechToPayrollClass where InvoiceClassId in ('M2','ME', 'CD','CT','M3'))

select * from #t
union 
select* from #result

drop table #t
drop table #result


select
HO.WONumber ,iwo.TechCode as CompletedBy,iwo.LastupdatedDt as ClosedDate, tts.TechName ,ttsSup.Supervisor,ttsSup.TechName as SupervisorName,tdc.NAME as CustomerName, tdc.ADDRESS,tdc.PHONE

from
HO
inner join InternalWorkOrder iwo on ho.WONumber = iwo.WONumber
inner join tbl_data_customers tdc on iwo.CustomerID =  tdc.CUSTOMERID
inner join tbl_HourlyInvoiceLine ihl on HO.WONumber = ihl.WONumber
inner join tbl_TechtoSupervisor tts on iwo.TechCode = tts.TechCode
inner join tbl_TechtoSupervisor ttsSup on tts.Supervisor = ttsSup.TechCode







