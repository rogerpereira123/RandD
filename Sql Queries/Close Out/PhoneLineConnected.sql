select
tjs.WONumber,tdc.Name, tdc.Phone, tjs.WorkOrderType , tjs.TechCode , zts.Supervisor , tjs.MgtArea, tjs.CSGLastChangedDate
from 
tbl_Acct_notes notes
inner join tbl_data_customers tdc on notes.customerid = tdc.customerid
inner join tbl_data_job_setup tjs on tdc.CustomerId = tjs.CustomerID
inner join tbl_ZipToSupervisor zts on tjs.CustomerZip = zts.ZipCode
where
tjs.CSGLastChangedDAte >= '11/01/2009'
and
tjs.CSGLastCHangedDate <= '11/14/2009'
and
notes.DDAdditionalNote like '%phone line connected%'
and
convert(varchar(10) , notes.date, 101) = convert(varchar(10) , tjs.csglastchangeddate , 101)
order by supervisor,csglastchangeddate
