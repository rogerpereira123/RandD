set ANSI_NULLS ON
set QUOTED_IDENTIFIER ON
GO

ALTER  PROCEDURE [dbo].[usp_getHoldNLOSWOStatus]  
@datetime_TodaysDate datetime,  
@datetime_CreatedDate datetime,  
@vchar_LoginID varchar(8)  
  
AS  
Begin  
  
select tjs.SaleDate, tdc.Name CustomerName, tdc.Phone, tjs.WONumber, tjs.WorkOrderType,   
case   
when   
(DateDiff(day,  
cast(Convert(varchar(12),tjs.Saledate,101) as datetime),  
cast(Convert(varchar(12),@datetime_TodaysDate,101) as datetime)  
 ))<=2  
then 1  
when   
(DateDiff(day,  
cast(Convert(varchar(12),tjs.Saledate,101) as datetime),  
cast(Convert(varchar(12),@datetime_TodaysDate,101) as datetime)  
 ))=3  
then 2   
when  
(DateDiff(day,  
cast(Convert(varchar(12),tjs.Saledate,101) as datetime),  
cast(Convert(varchar(12),@datetime_TodaysDate,101) as datetime)  
 ))>=4  
then 3  
end  
As ColorCode  
  
 from tbl_data_job_setup tjs   
inner join tbl_data_customers tdc on tjs.customerid=tdc.customerid  
inner join tbl_ZIPtoSupervisor tzs on tjs.CustomerZip=tzs.ZipCode  
 where   
Upper(ltrim(rtrim(tjs.WorkOrderstatus))) like '%HOLD-NLOS%' and tjs.WorkOrderType in ('NC', 'RC', 'RS')  
and tjs.Saledate>=@datetime_CreatedDate  
and tjs.SaleDate <= convert(datetime , getdate() , 101) 
and Upper(ltrim(rtrim(tjs.WorkOrderStatus)))<>'CANCELED'   
and Upper(ltrim(rtrim(tjs.WorkOrderStatus)))<>'COMPLETE'  
and Upper(rtrim(ltrim(isnull(tjs.techcode,'')))) not like 'RETAI%'  
and rtrim(ltrim(isnull(tjs.techcode,''))) not in ('4836','3807','8803')  
and upper(ltrim(rtrim(tjs.CSGSTATUS))) in ('O','R')  
and tzs.Supervisor=@vchar_LoginID  
End






