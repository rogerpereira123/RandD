USE [Northware]
GO
/****** Object:  StoredProcedure [dbo].[sp_InsertUpdate_jobsimported_new_WebService]    Script Date: 12/28/2012 14:41:30 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO









ALTER PROCEDURE [dbo].[sp_InsertUpdate_jobsimported_new_WebService] AS



begin
--Last Changed 04012009 No Completed / Cancelled jobs will be updated in Northware 


exec usp_QueueScheduledDayChanges 


--open in ultragold, closed/cancelled in econnect no status update
update tbl_data_job_setup 
set mgtarea=tbl_EConnectServiceAutodownload.MGT_AREA,Car_Value = tbl_EConnectServiceAutodownload.CAR_VALUE, customerid=tbl_EConnectServiceAutodownload.customerid, 
/* Per Victor on 05/01/2012...Update tech numbers from EConnect. Dont update for CANCELLED / COMPLETED jobs */
techcode = case when tbl_Data_Job_Setup.CSGStatus in ('C' , 'X') then rtrim(ltrim(tbl_Data_Job_Setup.TechCode))
else rtrim(ltrim(tbl_EConnectServiceAutodownload.TECH_NUMBER)) end,
--when tbl_EConnectServiceAutodownload.technumber not like '6%' then tbl_EConnectServiceAutodownload.technumber when tbl_EConnectServiceAutodownload.technumber  like '6%' then techcode end ,
Workunits= case when (tbl_data_job_setup.csgStatus = 'C' ) then WorkUnits else tbl_EConnectServiceAutodownload.units end,
scheduleddate= convert(datetime , convert(varchar(10) , tbl_EConnectServiceAutodownload.SCHEDULED_DATE,101), 101),
Servicecodes=tbl_EConnectServiceAutodownload.SERVICE_CODES,
hardware=tbl_EConnectServiceAutodownload.HARDWARE_DELIVERY,
Jobtype=convert(varchar(100) ,tbl_EConnectServiceAutodownload.classes),
TOD= CASE WHEN RIGHT(tbl_EConnectServiceAutodownload.SCHEDULED_DATE, 2) = 'AM' THEN '8AM-12 PM' WHEN RIGHT(tbl_EConnectServiceAutodownload.SCHEDULED_DATE, 2) = 'PM' THEN '12PM- 4PM' else '8AM-12 PM' END, 
	soldBy='DNSC',
	Saledate=cast(tbl_EConnectServiceAutodownload.WO_CREATE_DATE as datetime),
Jobstatus=tbl_EConnectServiceAutodownload.CSG_STATUS,Firstcode=LEFT(tbl_EConnectServiceAutodownload.SERVICE_CODES, 2),
reason1=tbl_EConnectServiceAutodownload.reason1,reason2=tbl_EConnectServiceAutodownload.reason2,reason3=tbl_EConnectServiceAutodownload.reason3,
reason4=tbl_EConnectServiceAutodownload.reason4,customerzip=tbl_EConnectServiceAutodownload.CUSTOMER_ZIP
,
--importedate=getdate(),
	 workordertype=tbl_EConnectServiceAutodownload.WORK_ORDER_TYPE, 

Category=tbl_EConnectServiceAutodownload.CATEGORY, 

WorkOrderStatus= tbl_EConnectServiceAutodownload.WORK_ORDER_STATE, 
/* Per Victor on 05/01/2012...Update CSGStatus from EConnect for everything. Overruled....Look at Where Clause*/
tbl_data_job_setup.CSGStatus = tbl_EConnectServiceAutodownload.csg_status, 
tbl_data_job_setup.CSGLastChangedDate = cast(tbl_EConnectServiceAutodownload.CSG_LAST_CHANGED_DATE as datetime)   
,segment_output = tbl_EConnectServiceAutodownload.segment_output,
LastUpdatedDate = GETDATE()
from tbl_EConnectServiceAutodownload inner join
tbl_data_job_setup on tbl_data_job_setup.jobid=isnull(tbl_EConnectServiceAutodownload.jobid , 0)
where  tbl_EConnectServiceAutodownload.JOBID IS NOT NULL 
and
--Per VIctor No Completed / Cancelled Job should be updated at all on 11/07/2012. This was done because tech closed job on tablet which was not supposed to be. With this fix, someone will know and can fix it.
tbl_data_job_setup.CSGStatus not in ('C' , 'X')



--On 11/05/2012. Update masked jobs so as to update reshceuled NC jobs and stuff.
update tjs
set tjs.techcode = case when tjs.CSGStatus in ('C' , 'X') then rtrim(ltrim(tjs.TechCode))
else rtrim(ltrim(esa.TECH_NUMBER)) end,
tjs.scheduleddate= convert(datetime , convert(varchar(10) , esa.SCHEDULED_DATE,101), 101),
Workunits= case when (tjs.csgStatus = 'C' ) then tjs.WorkUnits else esa.units end,
Servicecodes=esa.SERVICE_CODES,
TOD= CASE WHEN RIGHT(esa.SCHEDULED_DATE, 2) = 'AM' THEN '8AM-12 PM' WHEN RIGHT(esa.SCHEDULED_DATE, 2) = 'PM' THEN '12PM- 4PM' else '8AM-12 PM' END, 
tjs.CSGStatus = esa.csg_status, 
tjs.CSGLastChangedDate = cast(esa.CSG_LAST_CHANGED_DATE as datetime)  ,
WorkOrderStatus= esa.WORK_ORDER_STATE, 
LastUpdatedDate = GETDATE() 

from
tbl_data_job_setup tjs 
inner join tbl_EConnectServiceAutodownload esa on tjs.WONumber = esa.WORK_ORDER_NUMBER
where
tjs.ScheduledDate >= DATEADD(day , -30 , getdate()) and esa.JobId is null
and
--Per VIctor No Completed / Cancelled Job should be updated at all on 11/07/2012. This was done because tech closed job on tablet which was not supposed to be. With this fix, someone will know and can fix it.
tjs.CSGStatus not in ('C' , 'X')




update tbl_data_job_setup 
set 
mgtarea=tbl_EConnectServiceAutodownload.MGT_AREA,
Car_Value = tbl_EConnectServiceAutodownload.CAR_VALUE,
customerid=tbl_EConnectServiceAutodownload.customerid,
Workunits= case when (tbl_data_job_setup.csgStatus = 'C') then WorkUnits else tbl_EConnectServiceAutodownload.units end, 
scheduleddate=convert(datetime , convert(varchar(10) , tbl_EConnectServiceAutodownload.SCHEDULED_DATE,101), 101),
Servicecodes=tbl_EConnectServiceAutodownload.SERVICE_CODES,
hardware=tbl_EConnectServiceAutodownload.HARDWARE_DELIVERY,
Jobtype=convert(varchar(100) , tbl_EConnectServiceAutodownload.classes),
TOD= CASE WHEN RIGHT(tbl_EConnectServiceAutodownload.SCHEDULED_DATE, 2) = 'AM' THEN '8AM-12 PM' WHEN RIGHT(tbl_EConnectServiceAutodownload.SCHEDULED_DATE, 2) = 'PM' THEN '12PM- 4PM' END, 
	soldBy='DNSC',Saledate=cast(tbl_EConnectServiceAutodownload.WO_CREATE_DATE as datetime),
Firstcode=LEFT(tbl_EConnectServiceAutodownload.SERVICE_CODES, 2),
reason1=tbl_EConnectServiceAutodownload.reason1,
reason2=tbl_EConnectServiceAutodownload.reason2,
reason3=tbl_EConnectServiceAutodownload.reason3,
reason4=tbl_EConnectServiceAutodownload.reason4,
customerzip=tbl_EConnectServiceAutodownload.CUSTOMER_ZIP
--,importedate=getdate()
,
workordertype=tbl_EConnectServiceAutodownload.WORK_ORDER_TYPE, 

Category=tbl_EConnectServiceAutodownload.Category, 

segment_output = tbl_EConnectServiceAutodownload.segment_output,
/* Per Victor on 05/01/2012...Update tech numbers from EConnect. Dont update for CANCELLED / COMPLETED jobs */
techcode = case when tbl_Data_Job_Setup.CSGStatus in ('C' , 'X') then rtrim(ltrim(tbl_Data_Job_Setup.TechCode))
else rtrim(ltrim(tbl_EConnectServiceAutodownload.TECH_NUMBER)) end


 from tbl_EConnectServiceAutodownload inner join
tbl_data_job_setup on tbl_data_job_setup.jobid=isnull(tbl_EConnectServiceAutodownload.jobid , 0)
where  tbl_EConnectServiceAutodownload.JOBID IS NOT NULL  and
--Per VIctor No Completed / Cancelled Job should be updated at all on 11/07/2012. This was done because tech closed job on tablet which was not supposed to be. With this fix, someone will know and can fix it.
tbl_data_job_setup.CSGStatus not in ('C' , 'X')




--Update the Dish Tech Codes in Northware with the E-Connect Tech Codes
/*Update tbl_data_job_setup 
set techcode = tij.TechNumber
from tbl_EConnectServiceAutodownload tij
where
tbl_data_job_setup.JobId = tij.JobId
and
tbl_data_job_setup.TechCode like '87%'
and 
tij.TechNumber like '6%'*/




--- ignore canclled in ultragold with jobid null and insert new jobs. always ener them as new job
declare @WorkOrders table ( WONumber varchar(20))
insert into @WorkOrders
select WORK_ORDER_NUMBER from tbl_EConnectServiceAutodownload 
where JobId is null and CustomerId is not null
declare @WO varchar(20)
while(Exists(select * from @WorkOrders))
begin
	set @WO = (select top 1 WONumber from @WorkOrders)
	if(exists(select * from tbl_WorkOrderNumberToOrderId where OrderId = @WO))
	begin
		declare @E varchar(20) = (select WONumber from tbl_WorkOrderNumberToOrderId where OrderId = @WO)
		exec usp_UpdateExistingWorkOrderNumberWithOrderId @E , @WO
		update tbl_EConnectServiceAutodownload set
		JobId = tbl_Data_Job_Setup.JobID
		from tbl_Data_Job_Setup
		where tbl_Data_Job_Setup.WONumber = tbl_EConnectServiceAutodownload.WORK_ORDER_NUMBER
		 and tbl_EConnectServiceAutodownload.WORK_ORDER_NUMBER = @WO
		
	end
	delete from @WorkOrders where WONumber = @WO
end
delete from @WorkOrders
insert into @WorkOrders
select WORK_ORDER_NUMBER from tbl_EConnectServiceAutodownload 
where JobId is null and CustomerId is not null
while(exists(select * from @WorkOrders))
begin
set @WO = (select top 1 WONumber from @WorkOrders)
	if(exists(select * from tbl_Data_Job_Setup where WONumber = @WO))
	begin
		exec usp_UpdateExistingWorkOrderNumberWithD @WO
	end
	
	delete from @WorkOrders where WONumber = @WO
end
delete from @WorkOrders
insert into @WorkOrders
select distinct WORK_ORDER_NUMBER 
from tbl_EConnectServiceAutodownload 
group by WORK_ORDER_NUMBER having count(WORK_ORDER_NUMBER) > 1

delete esa from tbl_EConnectServiceAutodownload as esa 
inner join @WorkOrders w on esa.WORK_ORDER_NUMBER = w.WONumber 
where
esa.UPDATED_DATE is null

delete esa from tbl_EConnectServiceAutodownload as esa 
inner join @WorkOrders w on esa.WORK_ORDER_NUMBER = w.WONumber 
where
esa.UPDATED_DATE <> (select max(isnull(Updated_date, getdate())) from tbl_EConnectServiceAutodownload where  WORK_ORDER_NUMBER = w.WONumber)

delete esa from tbl_EConnectServiceAutodownload as esa 
inner join @WorkOrders w on esa.WORK_ORDER_NUMBER = w.WONumber 
where
esa.UPDATED_DATE = (select min(isnull(Updated_date, getdate())) from tbl_EConnectServiceAutodownload where  WORK_ORDER_NUMBER = w.WONumber)


insert into tbl_data_job_setup(customerid, mgtarea, techcode,Workunits,scheduleddate ,WOnumber,Servicecodes,hardware,Jobtype,TOD,soldBy,
	Saledate,Jobstatus,Firstcode,reason1,reason2,reason3,reason4,customerzip,
importedate,workordertype,Category,WorkOrderStatus,csgstatus,CSGLastChangedDate,OriginalSchDate,Segment_Output,longitude,latitude,geocoding_quality , Car_Value, LastUpdatedDate)
SELECT     CustomerId, MGT_AREA, rtrim(ltrim(TECH_NUMBER)), UNITS,convert(varchar(10),SCHEDULED_DATE,101), WORK_ORDER_NUMBER, SERVICE_CODES, HARDWARE_DELIVERY, 
                      convert(varchar(100) , CLASSES), tod = CASE WHEN RIGHT(SCHEDULED_DATE, 2) = 'AM' THEN '8AM-12 PM' WHEN RIGHT(SCHEDULED_DATE, 2) = 'PM' THEN '12PM- 4PM' else '8AM-12 PM'  END, 
                      'DNSC', WO_CREATE_DATE, 'O', LEFT(SERVICE_CODES, 2) AS FIRSTCODE, REASON1, REASON2, REASON3, REASON4, CUSTOMER_ZIP, 
                      GETDATE(), WORK_ORDER_TYPE,Category,WORK_ORDER_STATE, csg_status, CSG_LAST_CHANGED_DATE,convert(varchar(10) , tbl_EConnectServiceAutodownload.[PREVIOUS_SCHEDULED_DATE],101),Segment_Output,longitude,latitude,geocoding_quality, tbl_EConnectServiceAutodownload.CAR_VALUE, GETDATE()
FROM  tbl_EConnectServiceAutodownload WHERE JOBID IS NULL 
--AND csgSTATUS <> 'X' 
and customerid is not null 


update tbl_data_job_setup 
set 
/* Per Victor on 05/01/2012...Update CSGStatus from EConnect for everything.*/
tbl_data_job_setup.WorkOrderStatus=tbl_EConnectServiceAutodownload.WORK_ORDER_STATE, 
tbl_data_job_setup.CSGStatus = tbl_EConnectServiceAutodownload.csg_status , 
tbl_data_job_setup.CSGLastChangedDate = cast(tbl_EConnectServiceAutodownload.CSG_LAST_CHANGED_DATE as datetime)   from tbl_EConnectServiceAutodownload inner join
tbl_data_job_setup on tbl_data_job_setup.jobid=tbl_EConnectServiceAutodownload.jobid
where  tbl_EConnectServiceAutodownload.JOBID IS NOT NULL and
--Per VIctor No Completed / Cancelled Job should be updated at all on 11/07/2012. This was done because tech closed job on tablet which was not supposed to be. With this fix, someone will know and can fix it.
tbl_data_job_setup.CSGStatus not in ('C' , 'X')




update tbl_data_job_setup
set
longitude = tbl_EConnectServiceAutodownload.longitude,
latitude = tbl_EConnectServiceAutodownload.latitude,
geocoding_quality = tbl_EConnectServiceAutodownload.geocoding_quality
from tbl_EConnectServiceAutodownload
where
(tbl_data_job_setup.longitude is null or tbl_data_job_setup.longitude = '' or  tbl_data_job_setup.longitude like '-99%'
or
tbl_data_job_setup.latitude is null or tbl_data_job_setup.latitude = '' or tbl_data_job_setup.latitude like '99%'
or
tbl_data_job_setup.geocoding_quality is null or tbl_data_job_setup.geocoding_quality = '')
and
tbl_data_job_setup.JobID = tbl_EConnectServiceAutodownload.JobId



--Per Jack on 11/17/2010 any pole mount job with 12 units should be reduced to 6 units based on service code 2~
update tbl_Data_Job_Setup
set WorkUnits = 6
from tbl_EConnectServiceAutodownload ec
where
ec.JobId = tbl_Data_Job_Setup.JobId
and
tbl_Data_Job_Setup.servicecodes like '%2~%'
/* Per victor any work order type
and 
tbl_Data_Job_Setup.WorkorderType = 'CH'*/
and
tbl_Data_Job_Setup.WorkUnits = 12

update tbl_Data_Job_Setup
set ServiceCodes = tbl_EConnectServiceAutodownload.SERVICE_CODES
from tbl_EConnectServiceAutodownload
where
tbl_Data_Job_Setup.JobID = tbl_EConnectServiceAutodownload.JobId
and
servicecodes <> tbl_EConnectServiceAutodownload.SERVICE_CODES

update tbl_Data_Job_Setup
set 
TechCode = mtct.MasterTechCode
from tbl_MasterTechToChildTech mtct, tbl_EConnectServiceAutodownload esa 
where mtct.ChildTechCode = esa.TECH_NUMBER and tbl_Data_Job_Setup.JobID = esa.JobId

end




















