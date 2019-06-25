create Procedure [dbo].[usp_getJobsBasedOnNotes]    
 @startDate datetime,                        
 @endDate datetime,                            
 @noteString varchar(500)
 
 As    
 begin

select
tjs.WONumber,tdc.Name, tdc.Phone, tjs.WorkOrderType , tjs.TechCode , zts.Supervisor , tjs.MgtArea, tjs.CSGLastChangedDate
from 
tbl_Acct_notes notes
inner join tbl_data_customers tdc on notes.customerid = tdc.customerid
inner join tbl_data_job_setup tjs on tdc.CustomerId = tjs.CustomerID
inner join tbl_ZipToSupervisor zts on tjs.CustomerZip = zts.ZipCode
where
tjs.CSGLastChangedDAte >= @startDate
and
tjs.CSGLastCHangedDate <= @endDate
and
notes.DDAdditionalNote like '%'+@noteString+'%'
and
convert(varchar(10) , notes.date, 101) = convert(varchar(10) , tjs.csglastchangeddate , 101)
order by supervisor,csglastchangeddate
end