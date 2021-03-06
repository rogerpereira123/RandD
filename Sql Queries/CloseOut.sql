set ANSI_NULLS ON
set QUOTED_IDENTIFIER ON
go






















ALTER procedure [dbo].[usp_getCSGOpenWOScheduled_New]     --Open Work Orders          
@dateTime_ScheduledDate datetime,      
@vchar_Supervisor varchar(8),      
@vchar_Team varchar(2),      
@vchar_Ma varchar(2),      
@techCode varchar(8),      
@phone varchar(10),      
@openclose varchar(10),      
@county varchar(10),      
@NotClockedIn varchar(5),      
@CustomerName varchar(300),    
@vchar_SerialNo varchar(50),    
@techName varchar(500)      
      
                          
as          
Begin       
  
if(@TechCode is not null)      
begin         
 Select       
fromView.JobId, fromView.TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.PreviousInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MGTArea as MA,        
fromView.WorkorderType as WOType,      
'E' as RecType,fromView.Category as Category,      
Convert(varchar(12),fromView.CSGLastChangedDate,101) as CompletedDate,       
CAST(CONVERT(varchar(10), fromView.ScheduledDate, 101) AS DateTime) as SchDate,      
Case when fromView.TOD='8AM-12 PM' then 'AM'                      
when fromView.TOD='12PM- 4PM' then 'PM' end as SchTime,      
fromView.WorkOrderStatus as WOStatus,fromView.CSGStatus as CSGStatus,      
fromView.TechName,      
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime      
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime           
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
 into #temptech1      
from Dish_Wo_Details_View fromView      
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                         
where 
(
cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime) < @dateTime_ScheduledDate          
and
cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime) >= '01/23/2008'
and Upper(ltrim(rtrim(fromView.CSGStatus)))not in ('C' , 'X' , 'D' , 'G')         
and Upper(ltrim(rtrim(fromView.WorkOrderStatus))) not like '%HOLD%'          
and fromView.TechCode = @TechCode
)
or
(
cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
and Upper(ltrim(rtrim(fromView.CSGStatus))) not in ('X' , 'G')          
and Upper(ltrim(rtrim(fromView.WorkOrderStatus))) not like '%HOLD%'          
and fromView.TechCode = @TechCode )


          
--Union  

/* Select       
fromView.JobId, fromView.TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.PreviousInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MGTArea as MA,        
fromView.WorkorderType as WOType,      
'E' as RecType,fromView.Category as Category,      
Convert(varchar(12),fromView.CSGLastChangedDate,101) as CompletedDate,       
CAST(CONVERT(varchar(10), fromView.ScheduledDate, 101) AS DateTime) as SchDate,      
Case when fromView.TOD='8AM-12 PM' then 'AM'                      
when fromView.TOD='12PM- 4PM' then 'PM' end as SchTime,      
fromView.WorkOrderStatus as WOStatus,fromView.CSGStatus as CSGStatus,      
fromView.TechName,      
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime      
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime           
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
 into #temptech3      
from Dish_Wo_Details_View fromView      
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                         
where  
cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime) < @dateTime_ScheduledDate          
and
cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime) >= '01/23/2008'
and Upper(ltrim(rtrim(fromView.CSGStatus)))not in ('C' , 'X' , 'D' , 'G')         
and Upper(ltrim(rtrim(fromView.WorkOrderStatus))) not like '%HOLD%'          
and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'          
and fromView.TechCode = @TechCode      */
                                  
                          
      
select           
' ' as JobId, ' ' as TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.LastInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MgtArea as MA,      
fromView.WorkOrderType as WOType,          
'I' as RecType,' 'as Category,       
fromView.LastUpdatedDt as CompletedDate,          
CAST(CONVERT(varchar(10), fromView.ScheduledDate, 101) AS DateTime) as SchDate,       
fromView.ScheduledTime as SchTime,      
fromView.Status as WOStatus,fromView.Status as CSGStatus,       
fromView.TechName,         
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime      
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime        
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
into #temptech2                       
from Internal_Wo_Details_View as fromView       
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                      
where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)<=@dateTime_ScheduledDate          
and
cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime) >= '01/23/2008'
and fromView.Status in ('A' , 'O' , 'R')          
and fromView.TechCode  = @TechCode   

/*select           
' ' as JobId, ' ' as TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.LastInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MgtArea as MA,      
fromView.WorkOrderType as WOType,          
'I' as RecType,' 'as Category,       
fromView.LastUpdatedDt as CompletedDate,          
CAST(CONVERT(varchar(10), fromView.ScheduledDate, 101) AS DateTime) as SchDate,       
fromView.ScheduledTime as SchTime,      
fromView.Status as WOStatus,fromView.Status as CSGStatus,       
fromView.TechName,         
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime      
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime        
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
into #temptech4                       
from Internal_Wo_Details_View as fromView       
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                      
where  
cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime) < @dateTime_ScheduledDate          
and
cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime) >= '01/23/2008'
and fromView.Status in ('A' , 'O' , 'R')          
and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'       
and fromView.TechCode  = @TechCode  */         
      
      
select * from #temptech1      
union       
select * from #temptech2
/*union 
select * from #temptech3
union 
select * from #temptech4*/
order by SchDate desc
drop table #temptech1      
drop table #temptech2      
--drop table #temptech3      
--drop table #temptech4      

    
end    
                
else if(@dateTime_ScheduledDate is not null and @vchar_Supervisor is null and @vchar_Team is null and @vchar_Ma is null and @phone is null and @county is null and @openclose is null and @TechCode is null and @NotClockedIn is null   
and @CustomerName is null    
and @vchar_SerialNo is null and @TechName is null)  --for scheduled date only          
begin        
                        
Select      
fromView.JobId, fromView.TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.PreviousInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MGTArea as MA,        
fromView.WorkorderType as WOType,      
'E' as RecType,fromView.Category as Category,      
Convert(varchar(12),fromView.CSGLastChangedDate,101) as CompletedDate,       
Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,      
Case when fromView.TOD='8AM-12 PM' then 'AM'                      
when fromView.TOD='12PM- 4PM' then 'PM' end as SchTime,      
fromView.WorkOrderStatus as WOStatus,fromView.CSGStatus as CSGStatus,      
fromView.TechName,      
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime      
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime         
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
 case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
into #temp1            
from Dish_Wo_Details_View fromView      
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                         
where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'X' 
and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'G'         
and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'          
       
      
          
--Union                          
                          
select           
' ' as JobId, ' ' as TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.LastInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MgtArea as MA,      
fromView.WorkOrderType as WOType,          
'I' as RecType,' 'as Category,       
fromView.LastUpdatedDt as CompletedDate,          
Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,       
fromView.ScheduledTime as SchTime,      
fromView.Status as WOStatus,fromView.Status as CSGStatus,       
fromView.TechName,         
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime       
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime       
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
into #temp2                         
from Internal_Wo_Details_View as fromView       
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                      
where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
and fromView.Status in ('A' , 'O' , 'R')          
and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'       
      
select * from #temp1      
union       
select * from #temp2 order by TechName      
      
drop table #temp1      
drop table #temp2      
                          
end      
      
      
else if(@dateTime_ScheduledDate is not null and @vchar_Supervisor is null and @vchar_Team is null and @vchar_Ma is null and @phone is null and @county is null and @openclose is null and @TechCode is null and @NotClockedIn is null   
and @CustomerName is not null and @vchar_SerialNo is null  and @TechName is null)  --for customer name only          
begin        
                        
Select      
fromView.JobId, fromView.TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.PreviousInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MGTArea as MA,        
fromView.WorkorderType as WOType,      
'E' as RecType,fromView.Category as Category,      
Convert(varchar(12),fromView.CSGLastChangedDate,101) as CompletedDate,       
Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,      
Case when fromView.TOD='8AM-12 PM' then 'AM'                      
when fromView.TOD='12PM- 4PM' then 'PM' end as SchTime,      
fromView.WorkOrderStatus as WOStatus,fromView.CSGStatus as CSGStatus,      
fromView.TechName,      
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime      
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime         
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
 case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
into #tempCustomerName1            
from Dish_Wo_Details_View fromView      
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                         
where  
--cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
--and 
/*Upper(ltrim(rtrim(fromView.CSGStatus)))<>'X'          
and*/ 
Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'          
and rtrim(ltrim(isnull(fromView.techcode,''))) not in ('4836','3807','8803')          
and fromView.Name like '%'+@CustomerName+'%'      
and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'G'
      
          
--Union                          
                          
select           
' ' as JobId, ' ' as TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.LastInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MgtArea as MA,      
fromView.WorkOrderType as WOType,          
'I' as RecType,' 'as Category,       
fromView.LastUpdatedDt as CompletedDate,          
Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,       
fromView.ScheduledTime as SchTime,      
fromView.Status as WOStatus,fromView.Status as CSGStatus,       
fromView.TechName,         
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime       
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime       
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
into #tempCustomerName2                         
from Internal_Wo_Details_View as fromView       
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                      
where  
--cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
--and 
--fromView.Status in ('A' , 'C', 'P' , 'X')          
--and 
Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'       
and fromView.Name like '%'+@CustomerName+'%'     

      
select * from #tempCustomerName1      
union       
select * from #tempCustomerName2 order by TechName      
      
drop table #tempCustomerName1      
drop table #tempCustomerName2      
                          
end       
      
       
      
else if(@dateTime_ScheduledDate is not null and @vchar_Supervisor is not null and @vchar_Team is null and @vchar_Ma is null and @phone is null and @county is null and @openclose is null and @TechCode is null and @NotClockedIn is null and @CustomerName is
   
    
null and @vchar_SerialNo is null  and @TechName is null) --for scheduled date and supervisor                       
begin       
                         
Select       
fromView.JobId, fromView.TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.PreviousInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MGTArea as MA,        
fromView.WorkorderType as WOType,      
'E' as RecType,fromView.Category as Category,      
Convert(varchar(12),fromView.CSGLastChangedDate,101) as CompletedDate,       
Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,      
Case when fromView.TOD='8AM-12 PM' then 'AM'                      
when fromView.TOD='12PM- 4PM' then 'PM' end as SchTime,      
fromView.WorkOrderStatus as WOStatus,fromView.CSGStatus as CSGStatus,      
fromView.TechName,      
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime       
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime              
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
 into #temp3      
from Dish_Wo_Details_View fromView      
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                         
where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'X'  
and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'G'        
and Upper(ltrim(rtrim(fromView.WorkOrderStatus))) not like '%HOLD%'          
and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'          
and rtrim(ltrim(isnull(fromView.techcode,''))) not in ('4836','3807','8803')          
and fromView.Supervisor = @vchar_Supervisor      
        
--Union                          
                          
select           
' ' as JobId, ' ' as TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.LastInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MgtArea as MA,      
fromView.WorkOrderType as WOType,          
'I' as RecType,' 'as Category,       
fromView.LastUpdatedDt as CompletedDate,          
Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,       
fromView.ScheduledTime as SchTime,      
fromView.Status as WOStatus,fromView.Status as CSGStatus,       
fromView.TechName,         
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime       
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime       
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
into #temp4                         
from Internal_Wo_Details_View as fromView       
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate                        
where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
and fromView.Status in ('A' , 'O' , 'R')          
and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'       
and fromView.Supervisor = @vchar_Supervisor      
      
Select * from #temp3      
union      
Select * from #temp4 order by TechName      
      
drop table #temp3      
drop table #temp4      
      
end       
      
else if(@dateTime_ScheduledDate is not null and @vchar_Supervisor is null and @vchar_Team is not null and @vchar_Ma is null and @phone is null and @county is null and @openclose is null and @TechCode is null and @NotClockedIn is null and @CustomerName is 
  
    
null and @vchar_SerialNo is null and @TechName is null) --for scheduled date and team                       
begin       
      
Select       
fromView.JobId, fromView.TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.PreviousInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MGTArea as MA,        
fromView.WorkorderType as WOType,      
'E' as RecType,fromView.Category as Category,      
Convert(varchar(12),fromView.CSGLastChangedDate,101) as CompletedDate,       
Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,      
Case when fromView.TOD='8AM-12 PM' then 'AM'                      
when fromView.TOD='12PM- 4PM' then 'PM' end as SchTime,      
fromView.WorkOrderStatus as WOStatus,fromView.CSGStatus as CSGStatus,      
fromView.TechName,      
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime      
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime             
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
 into #temp5      
from Dish_Wo_Details_View as fromView      
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate                       
inner join tbl_teamToSupervisor as tms on fromView.Supervisor=tms.Supervisor      
                         
where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'X'     
and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'G'     
and Upper(ltrim(rtrim(fromView.WorkOrderStatus))) not like '%HOLD%'          
and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'          
and rtrim(ltrim(isnull(fromView.techcode,''))) not in ('4836','3807','8803')          
and fromView.CSGSTATUS in ('O','R')          
and tms.Team=@vchar_Team         
      
        
--Union                          
                          
select           
' ' as JobId, ' ' as TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.LastInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,       
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MgtArea as MA,      
fromView.WorkOrderType as WOType,          
'I' as RecType,' 'as Category,       
fromView.LastUpdatedDt as CompletedDate,          
Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,       
fromView.ScheduledTime as SchTime,      
fromView.Status as WOStatus,fromView.Status as CSGStatus,       
fromView.TechName,         
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime       
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime       
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
into #temp6                         
from Internal_Wo_Details_View as fromView       
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
inner join tbl_teamToSupervisor as tms on fromView.Supervisor=tms.Supervisor      
where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
and fromView.Status in ('A' , 'O')          
and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'       
and tms.team = @vchar_team      
      
Select * from #temp5      
Union       
Select * from #temp6 order by TechName      
drop table #temp5      
drop table #temp6      
      
end       
      
else if(@dateTime_ScheduledDate is not null and @vchar_Supervisor is null and @vchar_Team is null and @vchar_Ma is not null and @phone is null and @county is null and @openclose is null and @TechCode is null and @NotClockedIn is null and @CustomerName is
   
    
null and @vchar_SerialNo is null and @TechName is null)      
begin      
 Select       
fromView.JobId, fromView.TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.PreviousInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MGTArea as MA,        
fromView.WorkorderType as WOType,      
'E' as RecType,fromView.Category as Category,      
Convert(varchar(12),fromView.CSGLastChangedDate,101) as CompletedDate,       
Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,      
Case when fromView.TOD='8AM-12 PM' then 'AM'                      
when fromView.TOD='12PM- 4PM' then 'PM' end as SchTime,      
fromView.WorkOrderStatus as WOStatus,fromView.CSGStatus as CSGStatus,      
fromView.TechName,      
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime      
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime             
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
 into #temp7       
from Dish_Wo_Details_View fromView      
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                         
where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'X'    
and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'G'      
and Upper(ltrim(rtrim(fromView.WorkOrderStatus))) not like '%HOLD%'          
and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'          
and rtrim(ltrim(isnull(fromView.techcode,''))) not in ('4836','3807','8803')          
and fromView.MGTArea = @vchar_Ma      
          
--Union                          
                          
      
select           
' ' as JobId, ' ' as TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.LastInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MgtArea as MA,      
fromView.WorkOrderType as WOType,          
'I' as RecType,' 'as Category,       
fromView.LastUpdatedDt as CompletedDate,          
Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,       
fromView.ScheduledTime as SchTime,      
fromView.Status as WOStatus,fromView.Status as CSGStatus,       
fromView.TechName,         
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime       
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime       
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
into #temp8                         
from Internal_Wo_Details_View as fromView       
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate                        
where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
and fromView.Status in ('A' , 'O' , 'R')          
and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'       
and fromView.MgtArea  = @vchar_Ma      
      
      
select * from #temp7      
union       
select * from #temp8 order by TechName      
drop table #temp7      
drop table #temp8      
end        
      
else if(@dateTime_ScheduledDate is not null and @vchar_Supervisor is null and @vchar_Team is null and @vchar_Ma is null and @county is not null and @phone is null and @openclose is null and @TechCode is null and @NotClockedIn is null and @CustomerName is 
  
    
null and @vchar_SerialNo is null and @TechName is null)      
begin      
      
 Select       
fromView.JobId, fromView.TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.PreviousInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MGTArea as MA,        
fromView.WorkorderType as WOType,      
'E' as RecType,fromView.Category as Category,      
Convert(varchar(12),fromView.CSGLastChangedDate,101) as CompletedDate,       
Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,      
Case when fromView.TOD='8AM-12 PM' then 'AM'                      
when fromView.TOD='12PM- 4PM' then 'PM' end as SchTime,      
fromView.WorkOrderStatus as WOStatus,fromView.CSGStatus as CSGStatus,      
fromView.TechName,      
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime      
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime           
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
 into #tempcounty1      
from Dish_Wo_Details_View fromView      
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                         
where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'X'  
and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'G'        
and Upper(ltrim(rtrim(fromView.WorkOrderStatus))) not like '%HOLD%'          
and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'          
and rtrim(ltrim(isnull(fromView.techcode,''))) not in ('4836','3807','8803')          
and fromView.County = @county      
          
--Union                          
                          
      
select           
' ' as JobId, ' ' as TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.LastInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MgtArea as MA,      
fromView.WorkOrderType as WOType,          
'I' as RecType,' 'as Category,       
fromView.LastUpdatedDt as CompletedDate,          
Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,       
fromView.ScheduledTime as SchTime,      
fromView.Status as WOStatus,fromView.Status as CSGStatus,       
fromView.TechName,         
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime       
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime       
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
into #tempcounty2                        
from Internal_Wo_Details_View as fromView       
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                      
where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
and fromView.Status in ('A' , 'O' , 'R')          
and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'       
and fromView.County  = @county       
      
      
select * from #tempcounty1      
union       
select * from #tempcounty2 order by TechName      
drop table #tempcounty1      
drop table #tempcounty2      
end      
      
else if(@dateTime_ScheduledDate is not null and @vchar_Supervisor is null and @vchar_Team is null and @vchar_Ma is null and @county is null and @phone is not null and @openclose is null and @TechCode is null and @NotClockedIn is null and @CustomerName is
   
    
null and @vchar_SerialNo is null and @TechName is null)      
begin      
Select      
fromView.JobId, fromView.TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,      
fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder ,      
fromView.PreviousInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MGTArea as MA,        
fromView.WorkorderType as WOType,      
'E' as RecType,fromView.Category as Category,      
Convert(varchar(12),fromView.CSGLastChangedDate,101) as CompletedDate,       
Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,      
Case when fromView.TOD='8AM-12 PM' then 'AM'                      
when fromView.TOD='12PM- 4PM' then 'PM' end as SchTime,      
fromView.WorkOrderStatus as WOStatus,fromView.CSGStatus as CSGStatus,      
fromView.TechName,      
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime      
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime       
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
into #tempPhone1            
from Dish_Wo_Details_View fromView      
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber      
left join tbl_user as tuser on fromView.TechCode = tuser.UserId      
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode  and TCT.Date = fromView.ScheduledDate      
                         
where        
Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'          
and rtrim(ltrim(isnull(fromView.techcode,''))) not in ('4836','3807','8803')          
and 
(fromView.Phone = @phone or fromView.Phone2 = @phone)
and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'G'
 
          
--Union                          
                          
select      
' ' as JobId, ' ' as TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,           
fromView.LastInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MgtArea as MA,      
fromView.WorkOrderType as WOType,          
'I' as RecType,' 'as Category,       
fromView.LastUpdatedDt as CompletedDate,          
Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,       
fromView.ScheduledTime as SchTime,      
fromView.Status as WOStatus,fromView.Status as CSGStatus,       
fromView.TechName,         
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime       
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime       
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
into #tempPhone2                        
from Internal_Wo_Details_View as fromView       
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                      
where        
--cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate and       
/*fromView.Status = 'A'          
and */
Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'       
and (fromView.phone = @phone  or fromView.Phone2 = @phone )   

      
      
select * from #tempPhone1      
union       
select * from #tempPhone2 order by TechName      
      
drop table #tempPhone1      
drop table #tempPhone2      
end     
    
    
else if(@dateTime_ScheduledDate is not null and @vchar_Supervisor is null and @vchar_Team is null and @vchar_Ma is null and @county is null and @phone is null and @openclose is null and @TechCode is null and @NotClockedIn is null and @CustomerName is     
null and @vchar_SerialNo is null and @techName is not null)      
begin      
 Select       
fromView.JobId, fromView.TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.PreviousInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MGTArea as MA,        
fromView.WorkorderType as WOType,      
'E' as RecType,fromView.Category as Category,      
Convert(varchar(12),fromView.CSGLastChangedDate,101) as CompletedDate,       
Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,      
Case when fromView.TOD='8AM-12 PM' then 'AM'                      
when fromView.TOD='12PM- 4PM' then 'PM' end as SchTime,      
fromView.WorkOrderStatus as WOStatus,fromView.CSGStatus as CSGStatus,      
fromView.TechName,      
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime      
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime           
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
 into #temptechname1      
from Dish_Wo_Details_View fromView      
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                         
where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'X'
and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'G'          
and Upper(ltrim(rtrim(fromView.WorkOrderStatus))) not like '%HOLD%'          
and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'          
and rtrim(ltrim(isnull(fromView.techcode,''))) not in ('4836','3807','8803')          
and fromView.TechName like '%'+@TechName+'%'    
          
--Union                          
                          
      
select           
' ' as JobId, ' ' as TC_AssessCode,      
tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
fromView.JobOrder,      
fromView.LastInstaller as PrevTech,      
fromView.AccountNo,      
fromView.CustomerId,      
fromView.Address,      
fromView.City,      
fromView.State,      
fromView.Phone2,      
fromView.County,      
fromView.Name as CustomerName,          
fromView.Phone,          
fromView.ZipCode,          
fromView.WONumber as WONumber,          
fromView.TechCode,fromView.MgtArea as MA,      
fromView.WorkOrderType as WOType,          
'I' as RecType,' 'as Category,       
fromView.LastUpdatedDt as CompletedDate,          
Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,       
fromView.ScheduledTime as SchTime,      
fromView.Status as WOStatus,fromView.Status as CSGStatus,       
fromView.TechName,         
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
else ' ' end as ClockInHH,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
else ' ' end as ClockInMM,          
Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
else ' ' end as ClockInTime      
,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime        
,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
into #temptechname2                       
from Internal_Wo_Details_View as fromView       
left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber        
left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                      
where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
and fromView.Status in ( 'A' , 'O' , 'R')         
and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'       
and fromView.TechName like '%'+@TechName+'%'       
      
      
select * from #temptechname1      
union       
select * from #temptechname2 order by TechName      
drop table #temptechname1      
drop table #temptechname2      
end                                                           
      
else if(@dateTime_ScheduledDate is not null and @vchar_Supervisor is null and @vchar_Team is null and @vchar_Ma is null and @county is null and @phone is null and @openclose is not null and @TechCode is null and @NotClockedIn is null and @CustomerName is 
  
   
 null and @vchar_SerialNo is null and @TechName is null)      
begin      
 if(@openclose = 'OPEN')      
 begin      
    Select       
    fromView.JobId, fromView.TC_AssessCode,      
    tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
    fromView.JobOrder,      
    fromView.PreviousInstaller as PrevTech,      
    fromView.AccountNo,      
    fromView.CustomerId,      
    fromView.Address,      
    fromView.City,      
    fromView.State,      
    fromView.Phone2,      
    fromView.County,      
    fromView.Name as CustomerName,          
    fromView.Phone,          
    fromView.ZipCode,          
    fromView.WONumber as WONumber,          
    fromView.TechCode,fromView.MGTArea as MA,        
    fromView.WorkorderType as WOType,      
    'E' as RecType,fromView.Category as Category,      
    Convert(varchar(12),fromView.CSGLastChangedDate,101) as CompletedDate,       
    Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,      
    Case when fromView.TOD='8AM-12 PM' then 'AM'                      
    when fromView.TOD='12PM- 4PM' then 'PM' end as SchTime,      
    fromView.WorkOrderStatus as WOStatus,fromView.CSGStatus as CSGStatus,      
    fromView.TechName,      
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
    else ' ' end as ClockInHH,          
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
    else ' ' end as ClockInMM,          
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
    else ' ' end as ClockInTime      
    ,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime           
   ,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
    case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
     into #tempopenclose1      
    from Dish_Wo_Details_View fromView      
    left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber and twt.Clock_out is null      
    left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
    left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                             
    where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
    and Upper(ltrim(rtrim(fromView.CSGStatus))) not in ('X' , 'C' , 'G')          
    and Upper(ltrim(rtrim(fromView.WorkOrderStatus))) not like '%HOLD%'          
    and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'          
    and rtrim(ltrim(isnull(fromView.techcode,''))) not in ('4836','3807','8803')          
          
                      
              
    --Union                          
                              
      
    select           
                ' ' as JobId, ' ' as TC_AssessCode,      
    tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
    fromView.JobOrder,      
    fromView.LastInstaller as PrevTech,      
    fromView.AccountNo,      
    fromView.CustomerId,      
    fromView.Address,      
    fromView.City,      
    fromView.State,      
    fromView.Phone2,      
    fromView.County,      
    fromView.Name as CustomerName,          
    fromView.Phone,          
    fromView.ZipCode,          
    fromView.WONumber as WONumber,          
    fromView.TechCode,fromView.MgtArea as MA,      
    fromView.WorkOrderType as WOType,          
    'I' as RecType,' 'as Category,       
    fromView.LastUpdatedDt as CompletedDate,          
    Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,       
    fromView.ScheduledTime as SchTime,      
    fromView.Status as WOStatus,fromView.Status as CSGStatus,       
    fromView.TechName,         
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
    else ' ' end as ClockInHH,          
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
    else ' ' end as ClockInMM,          
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
    else ' ' end as ClockInTime      
    ,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime        
    ,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
    case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
    into #tempopenclose2                       
    from Internal_Wo_Details_View as fromView       
    left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber  and twt.Clock_out is null      
    left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
    left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                          
    where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
    and fromView.Status in ('A' , 'O' , 'R')          
    and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'       
          
          
      
    select * from #tempopenclose1      
     union       
     select * from #tempopenclose2 order by TechName      
     drop table #tempopenclose1      
     drop table #tempopenclose2      
     end      
  else if(@openclose = 'CLOSE')      
  begin      
      Select       
    fromView.JobId, fromView.TC_AssessCode,      
    tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
    fromView.JobOrder,      
    fromView.PreviousInstaller as PrevTech,      
    fromView.AccountNo,      
    fromView.CustomerId,      
    fromView.Address,      
    fromView.City,     
    fromView.State,      
    fromView.Phone2,      
    fromView.County,      
    fromView.Name as CustomerName,          
    fromView.Phone,          
    fromView.ZipCode,          
    fromView.WONumber as WONumber,          
    fromView.TechCode,fromView.MGTArea as MA,        
    fromView.WorkorderType as WOType,      
    'E' as RecType,fromView.Category as Category,      
    Convert(varchar(12),fromView.CSGLastChangedDate,101) as CompletedDate,       
    Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,      
    Case when fromView.TOD='8AM-12 PM' then 'AM'                      
    when fromView.TOD='12PM- 4PM' then 'PM' end as SchTime,      
    fromView.WorkOrderStatus as WOStatus,fromView.CSGStatus as CSGStatus,      
    fromView.TechName,      
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
    else ' ' end as ClockInHH,          
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
    else ' ' end as ClockInMM,          
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
    else ' ' end as ClockInTime      
    ,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime           
    ,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
    case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
     into #tempopenclose3      
    from Dish_Wo_Details_View fromView      
    inner join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber and twt.Clock_Out is not null      
    left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
    left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                             
    where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
    and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'X'   
	and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'G'       
    and Upper(ltrim(rtrim(fromView.WorkOrderStatus))) not like '%HOLD%'          
    and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'          
    and rtrim(ltrim(isnull(fromView.techcode,''))) not in ('4836','3807','8803')          
          
                                  
    --Union                          
                              
      
    select           
                ' '  as JobId,' ' as TC_AssessCode,      
    tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
    fromView.JobOrder,      
    fromView.LastInstaller as PrevTech,      
    fromView.AccountNo,      
    fromView.CustomerId,      
    fromView.Address,      
    fromView.City,      
    fromView.State,      
    fromView.Phone2,      
    fromView.County,      
    fromView.Name as CustomerName,          
    fromView.Phone,          
    fromView.ZipCode,          
    fromView.WONumber as WONumber,          
    fromView.TechCode,fromView.MgtArea as MA,      
    fromView.WorkOrderType as WOType,          
    'I' as RecType,' 'as Category,       
   fromView.LastUpdatedDt as CompletedDate,          
    Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,       
    fromView.ScheduledTime as SchTime,      
    fromView.Status as WOStatus,fromView.Status as CSGStatus,       
    fromView.TechName,         
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
    else ' ' end as ClockInHH,          
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
    else ' ' end as ClockInMM,          
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
    else ' ' end as ClockInTime      
    ,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime        
    ,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
    case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
    into #tempopenclose4         
    from Internal_Wo_Details_View as fromView       
    inner join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber and twt.Clock_Out is not null        
    left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
    left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                          
    where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
    and fromView.Status in ('C')          
    and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'       
          
          
      
        select * from #tempopenclose3      
     union       
     select * from #tempopenclose4 order by TechName      
     drop table #tempopenclose3      
     drop table #tempopenclose4      
  end       
      
end      
else if(@dateTime_ScheduledDate is not null and @vchar_Supervisor is null and @vchar_Team is null and @vchar_Ma is null and @county is null and @phone is null and @openclose is null and @TechCode is null and @NotClockedIn is not null and @CustomerName is
   
    
null and @vchar_SerialNo is null and @TechName is null)      
begin      
      
 if(@NotClockedIn = 'true')      
 begin      
       
      
 Select       
    fromView.JobId, fromView.TC_AssessCode,      
    tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
    fromView.JobOrder,      
    fromView.PreviousInstaller as PrevTech,      
    fromView.AccountNo,      
    fromView.CustomerId,      
    fromView.Address,      
    fromView.City,      
    fromView.State,      
    fromView.Phone2,      
    fromView.County,      
    fromView.Name as CustomerName,          
    fromView.Phone,          
    fromView.ZipCode,          
    fromView.WONumber as WONumber,          
    fromView.TechCode,fromView.MGTArea as MA,        
    fromView.WorkorderType as WOType,      
    'E' as RecType,fromView.Category as Category,      
    Convert(varchar(12),fromView.CSGLastChangedDate,101) as CompletedDate,       
    Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,      
    Case when fromView.TOD='8AM-12 PM' then 'AM'                      
    when fromView.TOD='12PM- 4PM' then 'PM' end as SchTime,      
    fromView.WorkOrderStatus as WOStatus,fromView.CSGStatus as CSGStatus,      
    fromView.TechName,      
    ' ' as ClockInHH,          
    ' ' as ClockInMM,          
    ' ' as ClockInTime      
    ,' ' as ClockOutTime           
    ,' ' as CSG,      
    case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
     into #tempnotclockedin1      
    from Dish_Wo_Details_View fromView      
    left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
    left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate       
                             
    where      
    fromView.WONumber not in (select WoNumber from tbl_WOTimes where Clock_In is not null)      
    and cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
    and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'X'  
	and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'G'        
    and Upper(ltrim(rtrim(fromView.WorkOrderStatus))) not like '%HOLD%'          
    and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'          
    and rtrim(ltrim(isnull(fromView.techcode,''))) not in ('4836','3807','8803')          
          
                      
              
    --Union                          
                              
      
    select           
                ' '  as JobId, ' ' as  TC_AssessCode,    
    tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
    fromView.JobOrder,      
    fromView.LastInstaller as PrevTech,      
    fromView.AccountNo,      
    fromView.CustomerId,      
    fromView.Address,      
    fromView.City,      
    fromView.State,      
    fromView.Phone2,      
    fromView.County,      
   fromView.Name as CustomerName,          
    fromView.Phone,          
    fromView.ZipCode,          
    fromView.WONumber as WONumber,          
    fromView.TechCode,fromView.MgtArea as MA,      
    fromView.WorkOrderType as WOType,          
    'I' as RecType,' 'as Category,       
    fromView.LastUpdatedDt as CompletedDate,          
    Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,       
    fromView.ScheduledTime as SchTime,      
    fromView.Status as WOStatus,fromView.Status as CSGStatus,       
    fromView.TechName,         
    ' ' as ClockInHH,          
    ' ' as ClockInMM,          
    ' ' as ClockInTime      
    ,' ' as ClockOutTime        
    ,' ' as CSG,      
    case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
    into #tempnotclockedin2      
    from Internal_Wo_Details_View as fromView       
    left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
    left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate       
                          
    where      
    fromView.WONumber not in (select WoNumber from tbl_WOTimes where Clock_In is not null)      
    and cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
    and fromView.Status in ('A' , 'O' , 'R')          
    and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'       
          
          
      
        select * from #tempnotclockedin1      
     union       
     select * from #tempnotclockedin2 order by TechName      
     drop table #tempnotclockedin1      
     drop table #tempnotclockedin2      
  end      
  else if(@NotClockedIn = 'false')      
  begin      
      
   Select       
    fromView.JobId, fromView.TC_AssessCode,      
    tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
    fromView.JobOrder,      
    fromView.PreviousInstaller as PrevTech,      
    fromView.AccountNo,      
    fromView.CustomerId,      
    fromView.Address,      
    fromView.City,      
    fromView.State,      
    fromView.Phone2,      
    fromView.County,      
    fromView.Name as CustomerName,          
    fromView.Phone,          
    fromView.ZipCode,          
    fromView.WONumber as WONumber,          
    fromView.TechCode,fromView.MGTArea as MA,        
    fromView.WorkorderType as WOType,      
    'E' as RecType,fromView.Category as Category,      
    Convert(varchar(12),fromView.CSGLastChangedDate,101) as CompletedDate,       
    Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,      
    Case when fromView.TOD='8AM-12 PM' then 'AM'                      
    when fromView.TOD='12PM- 4PM' then 'PM' end as SchTime,      
    fromView.WorkOrderStatus as WOStatus,fromView.CSGStatus as CSGStatus,      
    fromView.TechName,      
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
    else ' ' end as ClockInHH,          
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
    else ' ' end as ClockInMM,          
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
    else ' ' end as ClockInTime      
    ,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime           
    ,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
    case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
     into #tempnotclockedin3      
    from Dish_Wo_Details_View fromView      
    left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber and twt.Clock_Out is not null      
    left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
    left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                             
    where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
    and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'X' 
	and Upper(ltrim(rtrim(fromView.CSGStatus)))<>'G'         
    and Upper(ltrim(rtrim(fromView.WorkOrderStatus))) not like '%HOLD%'          
    and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'          
    and rtrim(ltrim(isnull(fromView.techcode,''))) not in ('4836','3807','8803')          
          
                      
              
    --Union                          
                              
      
    select           
                ' '  as JobId,      
    tuser.InvParticipantId as TechInvParticipantId,fromView.InvParticipantId as CustomerInvParticipantId,      
    fromView.JobOrder,      
    fromView.LastInstaller as PrevTech,      
    fromView.AccountNo,      
    fromView.CustomerId,      
    fromView.Address,      
    fromView.City,      
    fromView.State,      
    fromView.Phone2,      
    fromView.County,      
    fromView.Name as CustomerName,          
    fromView.Phone,          
    fromView.ZipCode,          
    fromView.WONumber as WONumber,          
    fromView.TechCode,fromView.MgtArea as MA,      
    fromView.WorkOrderType as WOType,          
    'I' as RecType,' 'as Category,       
    fromView.LastUpdatedDt as CompletedDate,          
    Convert(varchar(12),fromView.ScheduledDate,101) as SchDate,       
    fromView.ScheduledTime as SchTime,      
    fromView.Status as WOStatus,fromView.Status as CSGStatus,       
    fromView.TechName,         
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
    else ' ' end as ClockInHH,          
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
    else ' ' end as ClockInMM,          
    Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
    else ' ' end as ClockInTime      
    ,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime        
    ,case when twt.UserId is null then ' ' else twt.UserId end as CSG,      
    case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime      
    into #tempnotclockedin4         
    from Internal_Wo_Details_View as fromView       
    left join tbl_WOTimes as twt on fromView.WONumber=twt.WONumber and twt.Clock_Out is not null        
    left join tbl_user as tuser on fromView.TechCode = tuser.UserId        
    left join tbl_TechCheckInTimes as TCT on fromView.TechCode = TCT.TechCode and TCT.Date = @dateTime_ScheduledDate        
                          
    where  cast(Convert(varchar(12),fromView.ScheduledDate,101) as datetime)=@dateTime_ScheduledDate          
    and fromView.Status in ('A' , 'O' , 'R')          
    and Upper(rtrim(ltrim(isnull(fromView.techcode,'')))) not like 'RETAI%'       
          
          
      
        select * from #tempnotclockedin3      
     union       
     select * from #tempnotclockedin4 order by TechName      
     drop table #tempnotclockedin3      
     drop table #tempnotclockedin4       
  end     
    
end                                
--Commented By Jhansi 
 --else if(@dateTime_ScheduledDate is not null and @vchar_Supervisor is null and @vchar_Team is null and @vchar_Ma is null and @county is null and @openclose is null and @phone is null and @TechCode is null and @NotClockedIn is null and @CustomerName is  
   
--null and @vchar_SerialNo is not null and @TechName is null)    
else if(@vchar_SerialNo is not null)  
 begin     
 SELECT         
                TJS.JobId as JobId, 
	openstock.Consigner as TechInvParticipantId,
	--Commented By Jhansi      
      --tuser.InvParticipantId as TechInvParticipantId,    
  TDS.InvParticipantId as CustomerInvParticipantId,      
      TJS.JobOrder,      
      TJS.Previousinstaller as PrevTech,      
      TDS.AccountNo,      
      TDS.CustomerId,      
      TDS.Address,      
      TDS.City,      
      TDS.State,      
      TDS.Phone2,      
      TDS.County,      
      TDS.Name as CustomerName,          
      TDS.Phone,          
      TDS.ZipCode,          
      TJS.WONumber as WONumber,          
      TJS.TechCode,TJS.MgtArea as MA,      
      TJS.WorkOrderType as WOType,          
      'E' as RecType,    
  TJS.Category as Category,      
      Convert(varchar(12),TJS.CSGLastChangedDate,101) as CompletedDate,       
      Convert(varchar(12),TJS.ScheduledDate,101) as SchDate,      
      Case when TJS.TOD='8AM-12 PM' then 'AM'                      
      when TJS.TOD='12PM- 4PM' then 'PM' end as SchTime,      
      TJS.WorkOrderStatus as WOStatus,TJS.CSGStatus as CSGStatus,      
      TTS.TechName,      
      Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
      else ' ' end as ClockInHH,          
      Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
      else ' ' end as ClockInMM,          
      Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
      else ' ' end as ClockInTime      
      ,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime           
      ,case when twt.UserId is null then ' ' else twt.UserId end as CSG, 
	' '  as TechCheckInTime   
	--Commented By Jhansi 
      --case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime     
  from  tbl_InvTxn      
         
  inner join           
  (          
   select  distinct IT.invtxnid,Consigner,ITL.invtxnlineid,ITU.invtxnunitid,Wo2InvTxn.WONumber    
   from  tbl_InvTxn IT inner join tbl_InvTxnline ITL on IT.invtxnid=ITL.invtxnid    
   INNER JOIN tbl_Wo2InvTxn Wo2InvTxn on  Wo2InvTxn.InvTxnId=IT.InvTxnId       
   inner join tbl_InvTxnout2inunit ITO2IU on ITL.invtxnLineid=ITO2IU.invtxnLineOutid       
    inner join tbl_InvTxnunit ITU on ITU.invtxnunitid=ITO2IU.invtxnUnitid      
   where ITU.serialno1=@vchar_SerialNo  and DocType=34     
        
  ) as openstock          
   on tbl_InvTxn.invtxnid=openstock.invtxnid 
--Commented By Jhansi     
  --INNER JOIN tbl_Wo2InvTxn Wo2InvTxn on  Wo2InvTxn.InvTxnId=tbl_InvTxn.InvTxnId    
  INNER JOIN tbl_data_Job_setup TJS on TJS.WONumber=openstock.WONumber    
  INNER JOIN tbl_Data_Customers TDS ON TJS.CustomerID = TDS.CUSTOMERID 
--Commented By Jhansi    
 -- INNER JOIN tbl_user as tuser on TJS.TechCode = tuser.UserId    
  INNER JOIN tbl_TechtoSupervisor TTS ON TJS.TechCode = TTS.TechCode     
  left JOIN tbl_WOTimes as twt on TJS.WONumber=twt.WONumber and twt.Clock_Out is not null 
--Commented By Jhansi    
  --INNER JOIN tbl_TechCheckInTimes as TCT on TJS.TechCode = TCT.TechCode and TCT.Date =@dateTime_ScheduledDate                
      union

 SELECT         
                0 as JobId, 
	openstock.Consigner as TechInvParticipantId,
	--Commented By Jhansi      
      --tuser.InvParticipantId as TechInvParticipantId,    
  TDS.InvParticipantId as CustomerInvParticipantId,      
      TJS.JobOrder,      
      TJS.LastInstaller as PrevTech,      
      TDS.AccountNo,      
      TDS.CustomerId,      
      TDS.Address,      
      TDS.City,      
      TDS.State,      
      TDS.Phone2,      
      TDS.County,      
      TDS.Name as CustomerName,          
      TDS.Phone,          
      TDS.ZipCode,          
      TJS.WONumber as WONumber,          
      TJS.TechCode,TJS.MgtArea as MA,      
      TJS.WorkOrderType as WOType,          
      'E' as RecType,    
		0 as Category,      
      Convert(varchar(12),TJS.LastUpdatedDt,101) as CompletedDate,       
      Convert(varchar(12),TJS.ScheduledDate,101) as SchDate,      
      TJS.ScheduledTime ,      
      '' as WOStatus,TJS.Status as CSGStatus,      
      TTS.TechName,      
      Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 1, 2)          
      else ' ' end as ClockInHH,          
      Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 4, 2)           
      else ' ' end as ClockInMM,          
      Case when twt.Clock_In is not null then SUBSTRING(twt.Clock_In, 7, 2)           
      else ' ' end as ClockInTime      
      ,case when twt.Clock_Out is null then ' ' else twt.Clock_Out end as ClockOutTime           
      ,case when twt.UserId is null then ' ' else twt.UserId end as CSG, 
	' '  as TechCheckInTime   
	--Commented By Jhansi 
      --case when tct.Time is null then ' ' else tct.Time end as TechCheckInTime     
  from  tbl_InvTxn      
         
  inner join           
  (          
   select  distinct IT.invtxnid,Consigner,ITL.invtxnlineid,ITU.invtxnunitid,Wo2InvTxn.WONumber    
   from  tbl_InvTxn IT inner join tbl_InvTxnline ITL on IT.invtxnid=ITL.invtxnid    
   INNER JOIN tbl_Wo2InvTxn Wo2InvTxn on  Wo2InvTxn.InvTxnId=IT.InvTxnId       
   inner join tbl_InvTxnout2inunit ITO2IU on ITL.invtxnLineid=ITO2IU.invtxnLineOutid       
    inner join tbl_InvTxnunit ITU on ITU.invtxnunitid=ITO2IU.invtxnUnitid      
   where ITU.serialno1=@vchar_SerialNo  and DocType=34     
        
  ) as openstock          
   on tbl_InvTxn.invtxnid=openstock.invtxnid 
--Commented By Jhansi     
  --INNER JOIN tbl_Wo2InvTxn Wo2InvTxn on  Wo2InvTxn.InvTxnId=tbl_InvTxn.InvTxnId    
  INNER JOIN internalworkorder TJS on TJS.WONumber=openstock.WONumber    
  INNER JOIN tbl_Data_Customers TDS ON TJS.CustomerID = TDS.CUSTOMERID 
--Commented By Jhansi    
 -- INNER JOIN tbl_user as tuser on TJS.TechCode = tuser.UserId    
  INNER JOIN tbl_TechtoSupervisor TTS ON TJS.TechCode = TTS.TechCode     
  left JOIN tbl_WOTimes as twt on TJS.WONumber=twt.WONumber and twt.Clock_Out is not null 
 end    
    
End    
    
    
    
    
  























