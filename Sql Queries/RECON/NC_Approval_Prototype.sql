declare @W varchar(20) = '1001616171003015'
declare @LaborCodesExpLike varchar(5000) = ''
declare @LaborCodesExpIn varchar(5000) = ''
declare @SvcStr varchar(3000) = ''
declare @WorkOrderType varchar(20) = ''
set @SvcStr = ''
select @SvcStr =  ServiceCodes, @WorkOrderType = WorkorderType from tbl_Data_Job_Setup where WONumber = @W

declare @PastJobs table (WONumber varchar(20) , ClosedDate date , ServiceCodes varchar(3000))
declare @PastLearnings table ( WONumber varchar(20),ServiceCode varchar(20), Description varchar(2000) ,TaskNumber varchar(200), AmountPaid float)

insert into @PastJobs
select
top 100 tjs.WONumber, tjs.CSGLastChangedDate , tjs.ServiceCodes
from 
tbl_WOReconMaster wrm 
inner join tbl_Data_Job_Setup tjs on wrm.wonumber = tjs.wonumber
where
tjs.WorkorderType in (@WorkOrderType)
and wrm.WOReconStatusId = 'WR0001'
and tjs.WONumber <> @W
order by tjs.CSGLastChangedDate desc

--select * from @PastJobs
delete from @PastJobs where dbo.udf_Recon_IsMatchingTasks(@SvcStr , ServiceCodes) = 0

insert into @PastLearnings
select
rm.WONumber, rm.ServiceCode, rm.DishTaskDescription , rm.TaskNumber, rm.ApprovedAmount
from 
tbl_ReconMaster rm inner join (select top 1 * from @PastJobs) pj on rm.WONumber = pj.WONumber

where
rm.ReconStatusId = 'R0101'
and rm.RecordTypeId = 'L' and rm.ApprovedAmount > 10
order by rm.ServiceCode 


select  ServiceCode, TaskNumber, Description , AmountPaid from @PastLearnings 
