set ANSI_NULLS ON
set QUOTED_IDENTIFIER ON
GO

ALTER procedure [dbo].[usp_getTCSCWO_CurrentDate]
@datetime_CreatedDate datetime,
@vchar_AssignedBy varchar(30)

as
Begin
SET CONCAT_NULL_YIELDS_NULL OFF
Select 
tdc.Name as CustomerName,
tdc.Address, tdc.Phone, tdc.City, tdc.County,
tdc.ZipCode,
tjs.WONumber as WONumber,
tjs.TechCode,
tjs.Reason1 + tjs.reason2+tjs.reason3+tjs.reason4 as reason,
Convert(varchar(12),tjs.ScheduledDate,101)+' '+ Case when tjs.TOD='8AM-12 PM' then 'AM'
when tjs.TOD='12PM- 4PM' then 'PM' end as ScheduledDate,
tjs.WorkorderType as WorkOrderType, 
tjs.Category as Category,
cast(tjs.WorkUnits as varchar(9)) as Point,
Convert(varchar(12),tjs.Saledate,101) as WOCreateDate,
dbo.usp_getLastTechVisit(tjs.customerid,cast(Convert(varchar(12),tjs.Saledate,101)as datetime),tjs.WONumber) as IS12DaysTCSC,
dbo.usp_getPreviousWONumber(tjs.customerid,cast(Convert(varchar(12),tjs.Saledate,101)as datetime),tjs.WONumber) as PreviousWONumber,
dbo.usp_getPreviousTech(tjs.customerid,cast(Convert(varchar(12),tjs.Saledate,101)as datetime),tjs.WONumber) as PreviousTech

into #temp1
from tbl_Data_Job_Setup as tjs

inner join tbl_Data_Customers as tdc on tjs.CustomerID = tdc.CustomerID
inner join tbl_ZIPtoSupervisor as tzs on tjs.CustomerZip=tzs.ZipCode

where 
tzs.Supervisor=@vchar_AssignedBy and
Upper(ltrim(rtrim(tjs.WorkOrderStatus)))<>'CANCELED'
and ltrim(rtrim(Upper(tjs.techcode))) not like 'RETAI%'
and Upper(ltrim(rtrim(tjs.WorkOrderStatus)))<>'COMPLETE'
and Upper(ltrim(rtrim(tjs.WorkOrderStatus))) not like 'HOLD%'
and tjs.techcode not in ('4836','3807','8803')
and tjs.CSGSTATUS in ('O','R') 
and cast(Convert(varchar(10),tjs.Saledate,101) as datetime)=
cast(Convert(varchar(10),@datetime_CreatedDate,101) as datetime) 
and tjs.WorkorderType in ('TC', 'SC') 


delete  from #temp1 where IS12DaysTCSC<>1	

select #temp1.*,isnull(n.notes,' ') as WONotes
 from #temp1 left join tbl_Data_notes n
on #temp1.WONumber=n.WONumber
 where IS12DaysTCSC=1


End




