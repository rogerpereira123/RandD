set ANSI_NULLS ON
set QUOTED_IDENTIFIER ON
GO



ALTER  procedure [dbo].[usp_getTodaysWO]      
@vchar_ScheduledDate smalldatetime,      
@vchar_techCode varchar(8),      
@vchar_AssignedBy varchar(30)      
      
AS      
Begin       
if(@vchar_techcode is  null  and @vchar_AssignedBy  is not null) --only for supervisor      
begin     
Select            
tdc.Name as CustomerName,            
tdc.Address, tdc.Phone, tdc.City, tdc.County,            
tdc.ZipCode,            
tjs.WONumber as WONumber,            
tjs.TechCode,            
Convert(varchar(12),tjs.ScheduledDate,101)+' '+ Case when tjs.TOD='8AM-12 PM' then 'AM'            
when tjs.TOD='12PM- 4PM' then 'PM' end as ScheduledDate,            
tjs.WorkorderType as WorkOrderType,             
tjs.Category as Category,            
cast(tjs.WorkUnits as varchar(9)) as Point,            
case             
when tjs.Saledate is not null then            
            
abs(DateDiff(day,            
cast(Convert(varchar(12),tjs.Saledate,101) as datetime),            
cast(Convert(varchar(12),getdate(),101) as datetime)            
 ))            
else            
0            
end            
 as Age            
,            
'E' as RecType             
--Added on 11Sep06            
,dbo.usp_getLastInstaller(tjs.customerid,Convert(varchar(12),tjs.ScheduledDate,101)) as LastInstallerTech,            
tdc.STATE,tjs.JobOrder,             
tjs.ScheduledDate as schDate, case when tjs.TOD='8AM-12 PM' then 'AM'            
when tjs.TOD='12PM- 4PM' then 'PM' end as schTime,        
tjs.WorkOrderStatus as WOStatus,tjs.CSGStatus as CSGStatus,        
tjs.CSGLastChangedDate as CompletedDate ,    
Case when tjs.WorkorderType='TC' then    
dbo.usp_getLastTechVisit(tjs.customerid,cast(Convert(varchar(12),tjs.Saledate,101)as datetime),tjs.WONumber)    
when tjs.WorkorderType='SC' then    
dbo.usp_getLastTechVisit(tjs.customerid,cast(Convert(varchar(12),tjs.Saledate,101)as datetime),tjs.WONumber)    
else    
0 end    
as IS12DaysTCSC,' ' as TechName    
             
into #Temp1            
from tbl_Data_Job_Setup as tjs            
inner join tbl_Data_Customers as tdc on tjs.CustomerID = tdc.CustomerID            
--inner join tbl_ZIPtoSupervisor as tzs on tjs.CustomerZip=tzs.ZipCode            
where  cast(Convert(varchar(12),tjs.ScheduledDate,101) as datetime)=@vchar_ScheduledDate            
--and tzs.Supervisor=@vchar_AssignedBy            
and Upper(ltrim(rtrim(tjs.CSGStatus)))<>'X'            
and Upper(rtrim(ltrim(isnull(tjs.techcode,'')))) not like 'RETAI%'             
and Upper(ltrim(rtrim(tjs.CSGStatus)))<>'C'            
and Upper(ltrim(rtrim(tjs.WorkOrderStatus))) not like 'HOLD%'            
and rtrim(ltrim(isnull(tjs.techcode,''))) not in ('4836','3807','8803')             
and tjs.CSGSTATUS in ('O','R')     
    
Select * into #temp4 from #Temp1 where (ZipCode in(select distinct ZipCode from tbl_ZIPtoSupervisor  
where Supervisor=@vchar_AssignedBy) and TechCode not in (select distinct Supervisor from tbl_TechtoSupervisor      
where Supervisor<>@vchar_AssignedBy)) or TechCode=@vchar_AssignedBy or techcode is null
  
Select      
tdc.Name as CustomerName,      
tdc.Address, tdc.Phone, tdc.City, tdc.County,      
tdc.ZipCode,      
tjs.WONumber as WONumber,      
tjs.TechCode,      
Convert(varchar(12),tjs.ScheduledDate,101)+' '+ Case when tjs.TOD='8AM-12 PM' then 'AM'      
when tjs.TOD='12PM- 4PM' then 'PM' end as ScheduledDate,      
tjs.WorkorderType as WorkOrderType,       
tjs.Category as Category,      
cast(tjs.WorkUnits as varchar(9)) as Point,      
case       
when tjs.Saledate is not null then      
      
abs(DateDiff(day,      
cast(Convert(varchar(12),tjs.Saledate,101) as datetime),      
cast(Convert(varchar(12),getdate(),101) as datetime)      
 ))      
else      
0      
end      
 as Age      
,      
'E' as RecType       
--Added on 11Sep06      
,dbo.usp_getLastInstaller(tjs.customerid,Convert(varchar(12),tjs.ScheduledDate,101)) as LastInstallerTech,      
tdc.STATE,tjs.JobOrder,       
tjs.ScheduledDate as schDate, case when tjs.TOD='8AM-12 PM' then 'AM'      
when tjs.TOD='12PM- 4PM' then 'PM' end as schTime,    
tjs.WorkOrderStatus as WOStatus,tjs.CSGStatus as CSGStatus,    
tjs.CSGLastChangedDate as CompletedDate,    
0 as IS12DaysTCSC ,' ' as TechName    
      
into #Temp2      
from tbl_Data_Job_Setup as tjs      
inner join tbl_Data_Customers as tdc on tjs.CustomerID = tdc.CustomerID      
--inner join tbl_ZIPtoSupervisor as tzs on tjs.CustomerZip=tzs.ZipCode      
where  cast(Convert(varchar(12),tjs.ScheduledDate,101) as datetime)=@vchar_ScheduledDate      
--and tzs.Supervisor=@vchar_AssignedBy      
and Upper(rtrim(ltrim(isnull(tjs.techcode,'')))) not like 'RETAI%'      
and rtrim(ltrim(isnull(tjs.techcode,''))) not in ('4836','3807','8803')      
and upper(tjs.csgstatus) in ('C','R','X')    
and cast(Convert(varchar(12),tjs.CSGLastChangedDate,101) as datetime)=@vchar_ScheduledDate    
     
Select * into #temp5 from #Temp2 where (ZipCode in(select distinct ZipCode from tbl_ZIPtoSupervisor  
where Supervisor=@vchar_AssignedBy) and TechCode not in (select distinct Supervisor from tbl_TechtoSupervisor      
where Supervisor<>@vchar_AssignedBy)) or TechCode=@vchar_AssignedBy 
  
select       
tdc.Name as CustomerName,      
tdc.Address ,tdc.Phone, tdc.City, tdc.County,      
tdc.ZipCode,      
iwo.WONumber as WONumber,      
case when  (iwo.techcode is null or len(ltrim(rtrim(iwo.techcode)))=0)  then iwo.LastInstaller      
else      
iwo.TechCode      
end as techcode      
,      
Convert(varchar(12),iwo.ScheduledDate,101)+' '+ iwo.ScheduledTime as ScheduledDate,       
iwo.WorkOrderType as WorkOrderType,      
' ' as Category,      
'12'  as Point,      
abs(DateDiff(day, iwo.CreatedDt, getDate())) as Age,      
'I' as RecType      
--Added on 11Sep06      
,dbo.usp_getLastInstaller(iwo.customerid,Convert(varchar(12),iwo.ScheduledDate,101)) as LastInstallerTech,tdc.STATE,iwo.JobOrder,      
iwo.ScheduledDate as schDate,iwo.ScheduledTime as schTime,    
' ' as WOStatus,' ' as CSGStatus,    
' ' as CompletedDate,    
0 as IS12DaysTCSC ,' ' as TechName    
      
into #Temp3      
from InternalWorkOrder as iwo      
inner join tbl_Data_Customers as tdc on iwo.CustomerID = tdc.CustomerID      
inner join tbl_ZIPtoSupervisor as tzs on tdc.ZIPCODE=tzs.ZipCode      
where ScheduledDate = @vchar_ScheduledDate and iwo.Status = 'A'       
and tzs.Supervisor=@vchar_AssignedBy       
order by techcode, tdc.ZipCode,tdc.County      
      
select * from #Temp4    
union    
select * from #Temp5  
union       
select * from #Temp3    
order by schDate,techCode,schTime,county,zipcode    
     
end    
    
End      
      
  






