set ANSI_NULLS ON
set QUOTED_IDENTIFIER ON
GO













ALTER            procedure [dbo].[usp_getPreCallWOBySupervisorMA]
@datetime_CreatedDate datetime,
@datetime_ScheduledDate datetime,
@vchar_Supervisor varchar(8),     
@vchar_MgmtArea varchar(3),    
@int_StatusFilter int    
      
      
as        
    
Begin        
    
--ALL = -1 @int_StatusFilter 
--First Criteria
if(@datetime_CreatedDate is not null and @vchar_MgmtArea is null and @vchar_Supervisor is null)
begin
 Select        
 tdc.Name as CustomerName,tdc.AccountNo,
 tdc.Address, tdc.Phone, tdc.City, tdc.County,        
 tdc.ZipCode,        
 tjs.WONumber as WONumber,        
 tjs.TechCode,tjs.MGTArea,       
 Convert(varchar(12),tjs.ScheduledDate,101)+' '+ Case when tjs.TOD='8AM-12 PM' then 'AM'        
 when tjs.TOD='12PM- 4PM' then 'PM' end as ScheduledDate,        
 tjs.WorkorderType as WorkOrderType,         
 tjs.Category as Category,        
 cast(tjs.WorkUnits as varchar(9)) as Point,        
 Convert(varchar(12),tjs.Saledate,101) as WOCreateDate,        
 case         
 when tjs.Saledate is not null then        
 abs(DateDiff(day,        
 cast(Convert(varchar(12),tjs.Saledate,101) as datetime),        
 cast(Convert(varchar(12),tjs.ScheduledDate,101) as datetime)        
  ))        
 else        
 0        
 end        
 as Age,tjs.CSGStatus,tjs.WorkorderStatus,saledate,  
 tjs.ScheduledDate as schDate, case when tjs.TOD='8AM-12 PM' then 'AM'    
 when tjs.TOD='12PM- 4PM' then 'PM' end as schTime,tsr.ReviewNote
 into #WO4    
 from tbl_Data_Job_Setup as tjs        
 inner join tbl_Data_Customers as tdc on tjs.CustomerID = tdc.CustomerID        
 inner join tbl_ZIPtoSupervisor as tzs on tjs.CustomerZip=tzs.ZipCode        
 left join tbl_SupervisorReviewNotes as tsr on tjs.WONumber=tsr.WONumber 
 where    tjs.WorkorderType in ('NC', 'RS','RC')         
 and ltrim(rtrim(Upper(tjs.techcode))) not like 'RETAI%'      
 and Upper(ltrim(rtrim(tjs.WorkOrderStatus))) not like 'HOLD%'        
 and tjs.techcode not in ('4836','3807','8803')    
 and cast(Convert(varchar(10),tjs.Saledate,101) as datetime)=        
 cast(Convert(varchar(10),@datetime_CreatedDate,101) as datetime)  

if(@int_StatusFilter=-1) --ALL     
begin    
    
 select #WO4.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO4 left join tbl_Data_PreCall p   -- getting Not Pre Call only    
 on #WO4.WONumber=p.WONumber 
 left join tbl_WO_CheckStatus c on #WO4.WONumber=c.WONumber
 where p.woNumber is null and --c.WONumber is null and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
 union        -- Pre Called WOs    
    
 select #WO4.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO4 
inner join tbl_Data_PreCall p on #WO4.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID 
left join tbl_WO_CheckStatus c on #WO4.WONumber=c.WONumber    
where  
Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'  
 order by Saledate,schDate,schTime desc        
      
end    
    

if(@int_StatusFilter=-2) --ALL OPEN    
begin    
    
 select #WO4.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO4 left join tbl_Data_PreCall p   -- getting Not Pre Call only    
 on #WO4.WONumber=p.WONumber 
 left join tbl_WO_CheckStatus c on #WO4.WONumber=c.WONumber   
 where p.woNumber is null and --c.WONumber is null and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
 union        -- OPEN Pre Called WOs    
    
 select #WO4.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO4 
inner join tbl_Data_PreCall p on #WO4.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID
left join tbl_WO_CheckStatus c on #WO4.WONumber=c.WONumber    
where ps.Status_Desc not like 'Cancelled%' and ps.Status_Desc not like 'Confirmed%'    
 order by Saledate,schDate,schTime desc        
    
      
end     
if(@int_StatusFilter=1) -- Only for Not Pre Call    
begin    
 select #WO4.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO4 
left join tbl_Data_PreCall p  on #WO4.WONumber=p.WONumber  
left join tbl_WO_CheckStatus c on #WO4.WONumber=c.WONumber    
 where p.woNumber is null and --c.WONumber is null and       
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
end    
if(@int_StatusFilter>1)    
begin    
select #WO4.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO4 
inner join tbl_Data_PreCall p on #WO4.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID 
left join tbl_WO_CheckStatus c on #WO4.WONumber=c.WONumber
where p.status_ID=@int_StatusFilter    
 order by Saledate,schDate,schTime desc        
end 

 End

--Second Criteria
if(@datetime_CreatedDate is not null and @vchar_MgmtArea is not null and @vchar_Supervisor is null)
begin
 Select        
 tdc.Name as CustomerName, tdc.AccountNo,       
 tdc.Address, tdc.Phone, tdc.City, tdc.County,        
 tdc.ZipCode,        
 tjs.WONumber as WONumber,        
 tjs.TechCode,tjs.MGTArea,       
 Convert(varchar(12),tjs.ScheduledDate,101)+' '+ Case when tjs.TOD='8AM-12 PM' then 'AM'        
 when tjs.TOD='12PM- 4PM' then 'PM' end as ScheduledDate,        
 tjs.WorkorderType as WorkOrderType,         
 tjs.Category as Category,        
 cast(tjs.WorkUnits as varchar(9)) as Point,        
 Convert(varchar(12),tjs.Saledate,101) as WOCreateDate,        
 case         
 when tjs.Saledate is not null then        
 abs(DateDiff(day,        
 cast(Convert(varchar(12),tjs.Saledate,101) as datetime),        
 cast(Convert(varchar(12),tjs.ScheduledDate,101) as datetime)        
  ))        
 else        
 0        
 end        
 as Age,tjs.CSGStatus,tjs.WorkorderStatus,saledate,  
 tjs.ScheduledDate as schDate, case when tjs.TOD='8AM-12 PM' then 'AM'    
 when tjs.TOD='12PM- 4PM' then 'PM' end as schTime,tsr.ReviewNote
 into #WO    
 from tbl_Data_Job_Setup as tjs        
 inner join tbl_Data_Customers as tdc on tjs.CustomerID = tdc.CustomerID        
 inner join tbl_ZIPtoSupervisor as tzs on tjs.CustomerZip=tzs.ZipCode        
 left join tbl_SupervisorReviewNotes as tsr on tjs.WONumber=tsr.WONumber 
 where    tjs.WorkorderType in ('NC', 'RS','RC')         
 and ltrim(rtrim(Upper(tjs.techcode))) not like 'RETAI%'      
 and Upper(ltrim(rtrim(tjs.WorkOrderStatus))) not like 'HOLD%'        
 and tjs.techcode not in ('4836','3807','8803')        
 and tjs.MGTArea like @vchar_MgmtArea     
 and cast(Convert(varchar(10),tjs.Saledate,101) as datetime)=        
 cast(Convert(varchar(10),@datetime_CreatedDate,101) as datetime)  

if(@int_StatusFilter=-1) --ALL     
begin    
    
 select #WO.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO left join tbl_Data_PreCall p   -- getting Not Pre Call only    
 on #WO.WONumber=p.WONumber 
 left join tbl_WO_CheckStatus c on #WO.WONumber=c.WONumber
 where p.woNumber is null and --c.WONumber is null and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
 union        -- Pre Called WOs    
    
 select #WO.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO 
inner join tbl_Data_PreCall p on #WO.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID 
left join tbl_WO_CheckStatus c on #WO.WONumber=c.WONumber    
where  
Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'  
 order by Saledate,schDate,schTime desc        
      
end    
    

if(@int_StatusFilter=-2) --ALL OPEN    
begin    
    
 select #WO.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO left join tbl_Data_PreCall p   -- getting Not Pre Call only    
 on #WO.WONumber=p.WONumber 
 left join tbl_WO_CheckStatus c on #WO.WONumber=c.WONumber   
 where p.woNumber is null and --c.WONumber is null and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
 union        -- OPEN Pre Called WOs    
    
 select #WO.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO 
inner join tbl_Data_PreCall p on #WO.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID
left join tbl_WO_CheckStatus c on #WO.WONumber=c.WONumber    
where ps.Status_Desc not like 'Cancelled%' and ps.Status_Desc not like 'Confirmed%'    
 order by Saledate,schDate,schTime desc        
    
      
end     
if(@int_StatusFilter=1) -- Only for Not Pre Call    
begin    
 select #WO.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO 
left join tbl_Data_PreCall p  on #WO.WONumber=p.WONumber  
left join tbl_WO_CheckStatus c on #WO.WONumber=c.WONumber    
 where p.woNumber is null and --c.WONumber is null and       
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
end    
if(@int_StatusFilter>1)    
begin    
select #WO.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO inner join tbl_Data_PreCall p    
 on #WO.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID 
left join tbl_WO_CheckStatus c on #WO.WONumber=c.WONumber
where p.status_ID=@int_StatusFilter    
 order by Saledate,schDate,schTime desc        
end 

 End
 
--Third Criteria
if(@datetime_CreatedDate is not null and @vchar_MgmtArea is null and @vchar_Supervisor is not null)
begin
 Select        
 tdc.Name as CustomerName, tdc.AccountNo,       
 tdc.Address, tdc.Phone, tdc.City, tdc.County,        
 tdc.ZipCode,        
 tjs.WONumber as WONumber,        
 tjs.TechCode,tjs.MGTArea,       
 Convert(varchar(12),tjs.ScheduledDate,101)+' '+ Case when tjs.TOD='8AM-12 PM' then 'AM'        
 when tjs.TOD='12PM- 4PM' then 'PM' end as ScheduledDate,        
 tjs.WorkorderType as WorkOrderType,         
 tjs.Category as Category,        
 cast(tjs.WorkUnits as varchar(9)) as Point,        
 Convert(varchar(12),tjs.Saledate,101) as WOCreateDate,        
 case         
 when tjs.Saledate is not null then        
 abs(DateDiff(day,        
 cast(Convert(varchar(12),tjs.Saledate,101) as datetime),        
 cast(Convert(varchar(12),tjs.ScheduledDate,101) as datetime)        
  ))        
 else        
 0        
 end        
 as Age,tjs.CSGStatus,tjs.WorkorderStatus,saledate,  
 tjs.ScheduledDate as schDate, case when tjs.TOD='8AM-12 PM' then 'AM'    
 when tjs.TOD='12PM- 4PM' then 'PM' end as schTime,tsr.ReviewNote
 into #WO1    
 from tbl_Data_Job_Setup as tjs        
 inner join tbl_Data_Customers as tdc on tjs.CustomerID = tdc.CustomerID        
 inner join tbl_ZIPtoSupervisor as tzs on tjs.CustomerZip=tzs.ZipCode        
 left join tbl_SupervisorReviewNotes as tsr on tjs.WONumber=tsr.WONumber 
 where    tjs.WorkorderType in ('NC', 'RS','RC')         
 and ltrim(rtrim(Upper(tjs.techcode))) not like 'RETAI%'      
 and Upper(ltrim(rtrim(tjs.WorkOrderStatus))) not like 'HOLD%'        
 and tjs.techcode not in ('4836','3807','8803')    
 and cast(Convert(varchar(10),tjs.Saledate,101) as datetime)=        
 cast(Convert(varchar(10),@datetime_CreatedDate,101) as datetime)
 and tzs.Supervisor=@vchar_Supervisor 

if(@int_StatusFilter=-1) --ALL     
begin    
    
 select #WO1.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO1 left join tbl_Data_PreCall p   -- getting Not Pre Call only    
 on #WO1.WONumber=p.WONumber 
 left join tbl_WO_CheckStatus c on #WO1.WONumber=c.WONumber
 where p.woNumber is null and --c.WONumber is null and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
 union        -- Pre Called WOs    
    
 select #WO1.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO1 
inner join tbl_Data_PreCall p on #WO1.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID 
left join tbl_WO_CheckStatus c on #WO1.WONumber=c.WONumber    
where  
Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'  
 order by Saledate,schDate,schTime desc        
      
end    
    

if(@int_StatusFilter=-2) --ALL OPEN    
begin    
    
 select #WO1.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO1 left join tbl_Data_PreCall p   -- getting Not Pre Call only    
 on #WO1.WONumber=p.WONumber 
 left join tbl_WO_CheckStatus c on #WO1.WONumber=c.WONumber   
 where p.woNumber is null and --c.WONumber is null and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
 union        -- OPEN Pre Called WOs    
    
 select #WO1.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO1 
inner join tbl_Data_PreCall p on #WO1.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID
left join tbl_WO_CheckStatus c on #WO1.WONumber=c.WONumber    
where ps.Status_Desc not like 'Cancelled%' and ps.Status_Desc not like 'Confirmed%'    
 order by Saledate,schDate,schTime desc        
    
      
end     
if(@int_StatusFilter=1) -- Only for Not Pre Call    
begin    
 select #WO1.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO1 
left join tbl_Data_PreCall p  on #WO1.WONumber=p.WONumber  
left join tbl_WO_CheckStatus c on #WO1.WONumber=c.WONumber    
 where p.woNumber is null and --c.WONumber is null and       
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
end    
if(@int_StatusFilter>1)    
begin    
select #WO1.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO1
inner join tbl_Data_PreCall p  on #WO1.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID 
left join tbl_WO_CheckStatus c on #WO1.WONumber=c.WONumber
where p.status_ID=@int_StatusFilter    
 order by Saledate,schDate,schTime desc        
end 
 
End

--Fourth Criteria
if(@datetime_ScheduledDate is not null and @vchar_MgmtArea is not null and @vchar_Supervisor is null)
begin
 Select        
 tdc.Name as CustomerName,tdc.AccountNo,        
 tdc.Address, tdc.Phone, tdc.City, tdc.County,        
 tdc.ZipCode,        
 tjs.WONumber as WONumber,        
 tjs.TechCode,tjs.MGTArea,       
 Convert(varchar(12),tjs.ScheduledDate,101)+' '+ Case when tjs.TOD='8AM-12 PM' then 'AM'        
 when tjs.TOD='12PM- 4PM' then 'PM' end as ScheduledDate,        
 tjs.WorkorderType as WorkOrderType,         
 tjs.Category as Category,        
 cast(tjs.WorkUnits as varchar(9)) as Point,        
 Convert(varchar(12),tjs.Saledate,101) as WOCreateDate,        
 case         
 when tjs.Saledate is not null then        
 abs(DateDiff(day,        
 cast(Convert(varchar(12),tjs.Saledate,101) as datetime),        
 cast(Convert(varchar(12),tjs.ScheduledDate,101) as datetime)        
  ))        
 else        
 0        
 end        
 as Age,tjs.CSGStatus,tjs.WorkorderStatus,saledate,  
 tjs.ScheduledDate as schDate, case when tjs.TOD='8AM-12 PM' then 'AM'    
 when tjs.TOD='12PM- 4PM' then 'PM' end as schTime,tsr.ReviewNote
  into #WO2    
 from tbl_Data_Job_Setup as tjs        
 inner join tbl_Data_Customers as tdc on tjs.CustomerID = tdc.CustomerID        
 inner join tbl_ZIPtoSupervisor as tzs on tjs.CustomerZip=tzs.ZipCode        
 left join tbl_SupervisorReviewNotes as tsr on tjs.WONumber=tsr.WONumber 
 where    tjs.WorkorderType in ('NC', 'RS','RC')         
 and ltrim(rtrim(Upper(tjs.techcode))) not like 'RETAI%'      
 and Upper(ltrim(rtrim(tjs.WorkOrderStatus))) not like 'HOLD%'        
 and tjs.techcode not in ('4836','3807','8803')        
 and tjs.MGTArea like @vchar_MgmtArea     
 and cast(Convert(varchar(12),tjs.ScheduledDate,101) as datetime)=@datetime_ScheduledDate     

if(@int_StatusFilter=-1) --ALL     
begin     
 select #WO2.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO2
 left join tbl_Data_PreCall p on #WO2.WONumber=p.WONumber 
 left join tbl_WO_CheckStatus c on #WO2.WONumber=c.WONumber
 where p.woNumber is null and --c.WONumber is null and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
 union        -- Pre Called WOs    
    
 select #WO2.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO2 
inner join tbl_Data_PreCall p on #WO2.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID 
left join tbl_WO_CheckStatus c on #WO2.WONumber=c.WONumber    
where  
Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'  
 order by Saledate,schDate,schTime desc        
      
end    
    

if(@int_StatusFilter=-2) --ALL OPEN    
begin    
    
 select #WO2.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO2 
left join tbl_Data_PreCall p on #WO2.WONumber=p.WONumber 
 left join tbl_WO_CheckStatus c on #WO2.WONumber=c.WONumber   
 where p.woNumber is null and --c.WONumber is null and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
 union        -- OPEN Pre Called WOs    
    
 select #WO2.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO2 
inner join tbl_Data_PreCall p on #WO2.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID
left join tbl_WO_CheckStatus c on #WO2.WONumber=c.WONumber    
where ps.Status_Desc not like 'Cancelled%' and ps.Status_Desc not like 'Confirmed%'    
 order by Saledate,schDate,schTime desc        
    
      
end     
if(@int_StatusFilter=1) -- Only for Not Pre Call    
begin    
 select #WO2.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO2 
left join tbl_Data_PreCall p  on #WO2.WONumber=p.WONumber  
left join tbl_WO_CheckStatus c on #WO2.WONumber=c.WONumber    
 where p.woNumber is null and --c.WONumber is null and       
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
end    
if(@int_StatusFilter>1)    
begin    
select #WO2.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO2
 inner join tbl_Data_PreCall p  on #WO2.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID 
left join tbl_WO_CheckStatus c on #WO2.WONumber=c.WONumber
where p.status_ID=@int_StatusFilter    
 order by Saledate,schDate,schTime desc        
end 

 End
 
--Fifth Criteria
if(@datetime_ScheduledDate is not null and @vchar_MgmtArea is null and @vchar_Supervisor is not null)
begin
 Select        
 tdc.Name as CustomerName,tdc.AccountNo,        
 tdc.Address, tdc.Phone, tdc.City, tdc.County,        
 tdc.ZipCode,        
 tjs.WONumber as WONumber,        
 tjs.TechCode,tjs.MGTArea,       
 Convert(varchar(12),tjs.ScheduledDate,101)+' '+ Case when tjs.TOD='8AM-12 PM' then 'AM'        
 when tjs.TOD='12PM- 4PM' then 'PM' end as ScheduledDate,        
 tjs.WorkorderType as WorkOrderType,         
 tjs.Category as Category,        
 cast(tjs.WorkUnits as varchar(9)) as Point,        
 Convert(varchar(12),tjs.Saledate,101) as WOCreateDate,        
 case         
 when tjs.Saledate is not null then        
 abs(DateDiff(day,        
 cast(Convert(varchar(12),tjs.Saledate,101) as datetime),        
 cast(Convert(varchar(12),tjs.ScheduledDate,101) as datetime)        
  ))        
 else        
 0        
 end        
 as Age,tjs.CSGStatus,tjs.WorkorderStatus,saledate,  
 tjs.ScheduledDate as schDate, case when tjs.TOD='8AM-12 PM' then 'AM'    
 when tjs.TOD='12PM- 4PM' then 'PM' end as schTime,tsr.ReviewNote
 into #WO3    
 from tbl_Data_Job_Setup as tjs        
 inner join tbl_Data_Customers as tdc on tjs.CustomerID = tdc.CustomerID        
 inner join tbl_ZIPtoSupervisor as tzs on tjs.CustomerZip=tzs.ZipCode        
 left join tbl_SupervisorReviewNotes as tsr on tjs.WONumber=tsr.WONumber 
 where    --tjs.WorkorderType in ('NC', 'RS','RC')    and 
ltrim(rtrim(Upper(tjs.techcode))) not like 'RETAI%'      
 and Upper(ltrim(rtrim(tjs.WorkOrderStatus))) not like 'HOLD%'        
 and tjs.techcode not in ('4836','3807','8803')    
 and cast(Convert(varchar(12),tjs.ScheduledDate,101) as datetime)=@datetime_ScheduledDate    
 and tzs.Supervisor=@vchar_Supervisor  

if(@int_StatusFilter=-1) --ALL     
begin    
    
 select #WO3.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO3 
 left join tbl_Data_PreCall p on #WO3.WONumber=p.WONumber 
 left join tbl_WO_CheckStatus c on #WO3.WONumber=c.WONumber
 where p.woNumber is null and --c.WONumber is null and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
 union        -- Pre Called WOs    
    
 select #WO3.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO3
inner join tbl_Data_PreCall p on #WO3.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID 
left join tbl_WO_CheckStatus c on #WO3.WONumber=c.WONumber    
where  
Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'  
 order by Saledate,schDate,schTime desc        
      
end    
    

if(@int_StatusFilter=-2) --ALL OPEN    
begin    
    
 select #WO3.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO3 
 left join tbl_Data_PreCall p on #WO3.WONumber=p.WONumber 
 left join tbl_WO_CheckStatus c on #WO3.WONumber=c.WONumber   
 where p.woNumber is null and --c.WONumber is null and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
 union        -- OPEN Pre Called WOs    
    
 select #WO3.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO3 
inner join tbl_Data_PreCall p on #WO3.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID
left join tbl_WO_CheckStatus c on #WO3.WONumber=c.WONumber    
where ps.Status_Desc not like 'Cancelled%' and ps.Status_Desc not like 'Confirmed%'    
 order by Saledate,schDate,schTime desc        
    
      
end     
if(@int_StatusFilter=1) -- Only for Not Pre Call    
begin    
 select #WO3.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO3 
left join tbl_Data_PreCall p  on #WO3.WONumber=p.WONumber  
left join tbl_WO_CheckStatus c on #WO3.WONumber=c.WONumber    
 where p.woNumber is null and --c.WONumber is null and       
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
end    
if(@int_StatusFilter>1)    
begin    
select #WO3.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO3 
inner join tbl_Data_PreCall p on #WO3.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID 
left join tbl_WO_CheckStatus c on #WO3.WONumber=c.WONumber
where p.status_ID=@int_StatusFilter    
 order by Saledate,schDate,schTime desc        
end 

End
   
--Sixth Criteria
if(@datetime_ScheduledDate is not null and @vchar_MgmtArea is null and @vchar_Supervisor is null)
begin
 Select        
 tdc.Name as CustomerName,tdc.AccountNo,        
 tdc.Address, tdc.Phone, tdc.City, tdc.County,        
 tdc.ZipCode,        
 tjs.WONumber as WONumber,        
 tjs.TechCode,tjs.MGTArea,       
 Convert(varchar(12),tjs.ScheduledDate,101)+' '+ Case when tjs.TOD='8AM-12 PM' then 'AM'        
 when tjs.TOD='12PM- 4PM' then 'PM' end as ScheduledDate,        
 tjs.WorkorderType as WorkOrderType,         
 tjs.Category as Category,        
 cast(tjs.WorkUnits as varchar(9)) as Point,
 Convert(varchar(12),tjs.Saledate,101) as WOCreateDate,        
 case         
 when tjs.Saledate is not null then        
 abs(DateDiff(day,        
 cast(Convert(varchar(12),tjs.Saledate,101) as datetime),        
 cast(Convert(varchar(12),tjs.ScheduledDate,101) as datetime)        
  ))        
 else        
 0        
 end        
 as Age,tjs.CSGStatus,tjs.WorkorderStatus,saledate,  
 tjs.ScheduledDate as schDate, case when tjs.TOD='8AM-12 PM' then 'AM'    
 when tjs.TOD='12PM- 4PM' then 'PM' end as schTime,tsr.ReviewNote
 into #WO5   
 from tbl_Data_Job_Setup as tjs        
 inner join tbl_Data_Customers as tdc on tjs.CustomerID = tdc.CustomerID        
 inner join tbl_ZIPtoSupervisor as tzs on tjs.CustomerZip=tzs.ZipCode        
 left join tbl_SupervisorReviewNotes as tsr on tjs.WONumber=tsr.WONumber 
 where  --  tjs.WorkorderType in ('NC', 'RS','RC') and        
  ltrim(rtrim(Upper(tjs.techcode))) not like 'RETAI%'      
 and Upper(ltrim(rtrim(tjs.WorkOrderStatus))) not like 'HOLD%'        
 and tjs.techcode not in ('4836','3807','8803')  
 and cast(Convert(varchar(12),tjs.ScheduledDate,101) as datetime)=@datetime_ScheduledDate     

if(@int_StatusFilter=-1) --ALL     
begin    
    
 select #WO5.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO5
 left join tbl_Data_PreCall p on #WO5.WONumber=p.WONumber 
 left join tbl_WO_CheckStatus c on #WO5.WONumber=c.WONumber
 where p.woNumber is null and --c.WONumber is null and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
 union        -- Pre Called WOs    
    
 select #WO5.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO5 
inner join tbl_Data_PreCall p on #WO5.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID 
left join tbl_WO_CheckStatus c on #WO5.WONumber=c.WONumber    
where  
Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'  
 order by Saledate,schDate,schTime desc        
      
end    
    

if(@int_StatusFilter=-2) --ALL OPEN    
begin    
    
 select #WO5.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO5 
 left join tbl_Data_PreCall p on #WO5.WONumber=p.WONumber 
 left join tbl_WO_CheckStatus c on #WO5.WONumber=c.WONumber   
 where p.woNumber is null and --c.WONumber is null and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
 union        -- OPEN Pre Called WOs    
    
 select #WO5.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO5 
inner join tbl_Data_PreCall p on #WO5.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID
left join tbl_WO_CheckStatus c on #WO5.WONumber=c.WONumber    
where ps.Status_Desc not like 'Cancelled%' and ps.Status_Desc not like 'Confirmed%'    
 order by Saledate,schDate,schTime desc        
    
      
end     
if(@int_StatusFilter=1) -- Only for Not Pre Call    
begin    
 select #WO5.*,1 as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO5
left join tbl_Data_PreCall p  on #WO5.WONumber=p.WONumber  
left join tbl_WO_CheckStatus c on #WO5.WONumber=c.WONumber    
 where p.woNumber is null and --c.WONumber is null and       
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'COMPLETE'        
 and CSGSTATUS in ('O','R') and    
 Upper(ltrim(rtrim(WorkOrderStatus)))<>'CANCELED'        
    
end    
if(@int_StatusFilter>1)    
begin    
select #WO5.*, isnull(p.Status_ID,1) as precallstatus,isnull(c.ChkStatus,0) as ChkStatus from #WO5
inner join tbl_Data_PreCall p on #WO5.WONumber=p.WONumber 
inner join tbl_PreCallStatus ps on p.Status_ID=ps.Status_ID 
left join tbl_WO_CheckStatus c on #WO5.WONumber=c.WONumber
where p.status_ID=@int_StatusFilter    
 order by Saledate,schDate,schTime desc        
end 

 End   
    
End  
  
  
  















