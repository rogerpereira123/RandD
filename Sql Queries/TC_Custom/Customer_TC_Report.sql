declare @IsTc12Or30 int = 60
declare @startDate date = '04/01/2015'
declare @endDate date= '04/30/2015'
declare @techCode varchar(50) = ''
declare @supervisor varchar(50)= ''
declare @IsPayrollMode bit = 0
declare @TcOnTcMode bit = 0


--Please do not remove any fields as this SP is called in another stored procedure usp_GetTCJobs_LastEventBased
declare @TC table  
(  
CustID bigint,  
CustomerName varchar(300),  
TCJob varchar(20),  
TCWorkOrderType  varchar(20),  
TCTechCode varchar(100),  
TCStatus varchar(10),  
TCCreatedDate datetime,  
TCCompletedDate datetime,  
OrgJob varchar(20),  
OrgWorkOrderType varchar(20),  
OrgTechCode varchar(100),  
OrgTechName varchar(300),  
OrgStatus varchar(10),  
OrgCreatedDate datetime,  
OrgCompletedDate datetime,  
Supervisor varchar(100)  
)  
  
if(@supervisor is null or @supervisor = '' or @supervisor = '-1') begin set @supervisor = '%' end  
if(@techCode is not null and @techCode <> '')  
begin  
  insert into @TC  
  select    
  tdc.CustomerID, tdc.Name as CustomerName,tc.WoNumber as 'TCJob',tc.WorkorderType as TCWorkOrderType, tc.TechCode as TCTechCode, tc.CSGStatus as TCStatus , tc.SaleDate as TCCreatedDate, 
  tc.CSGLastChangedDate as TCCompletedDate,   
  pr.WONumber as OrgJob, pr.WorkorderType as OrgWorkOrderType,pr.TechCode as OrgTechCode,tde.Lastname +',' + tde.Firstname as OrgTechName,  pr.CSGStatus as OrgStatus, pr.SaleDate as OrgCreatedDate , 
  pr.CSGLastChangedDate as OrgCompletedDate,ttsView.Supervisor  
     
  from   
  tbl_data_job_setup tc  
  inner join tbl_data_job_setup pr on tc.CustomerId = pr.CustomerId   
  inner join tbl_data_customers tdc on tc.CustomerId = tdc.CustomerId  
  --inner join tbl_TechtoSupervisor tts on pr.TechCode = tts.TechCode  
  inner join tbl_User u on pr.TechCode = u.UserId   
  inner join tbl_Data_Employees tde on u.EmployeeID = tde.EmployeeID  
  inner join TTSView ttsView on ttsView.TechCode = pr.TechCode  
  where   
  tc.CSGLastChangedDate >= @startDate  
  and  
  tc.CSGLastChangedDate <= @endDate  
  and  
  (tc.WorkorderType in ('TC' ,'SC'))  
  and  
  pr.CSGStatus = 'C'  
  and  
  tc.wonumber <> pr.wonumber  
  and  
  datediff(Day,pr.CSGLastChangedDate, tc.saledate) <= @IsTc12Or30  
  and   
  datediff(Day,pr.CSGLastChangedDate, tc.saledate) >= 0  
  /*and  
  convert(bigint, substring(pr.WoNumber , len(pr.WONumber) - 5 , len(pr.WoNumber))) < convert(bigint, substring(tc.WoNumber , len(tc.WONumber) - 5 , len(tc.WoNumber)))*/  
  and  
  CONVERT(bigint, pr.WONumber) < CONVERT(bigint, tc.WoNumber)  
  and pr.TechCode = @techCode  
  order by tdc.CUSTOMERID  
    
    
end  
else   
begin  
  insert into @TC  
  select    
  tdc.CustomerID, tdc.Name as CustomerName,tc.WoNumber as 'TCJob',tc.WorkorderType as TCWorkOrderType, tc.TechCode as TCTechCode, tc.CSGStatus as TCStatus , 
  tc.SaleDate as TCCreatedDate, tc.CSGLastChangedDate as TCCompletedDate,pr.WONumber as OrgJob, pr.WorkorderType as OrgWorkOrderType,pr.TechCode as OrgTechCode,
  tts.TechName as  OrgTechName, pr.CSGStatus as OrgStatus, pr.SaleDate as OrgCreatedDate , pr.CSGLastChangedDate as OrgCompletedDate,tts.Supervisor as Supervisor  
     
  from   
  tbl_data_job_setup tc  
  inner join tbl_data_job_setup pr on tc.CustomerId = pr.CustomerId   
  inner join tbl_data_customers tdc on tc.CustomerId = tdc.CustomerId  
  --inner join tbl_TechtoSupervisor tts on pr.TechCode = tts.TechCode  
  inner join TTSView tts on pr.TechCode = tts.TechCode   
  left join tbl_OutOfMarketTechs oom on oom.TechCode = pr.TechCode  
  where   
  tc.CSGLastChangedDate >= @startDate  
  and  
  tc.CSGLastChangedDate <= @endDate  
  and  
  (tc.WorkorderType in ('TC' ,'SC'))  
  and  
  pr.CSGStatus = 'C'  
  and  
  tc.wonumber <> pr.wonumber  
  and  
  datediff(Day,pr.CSGLastChangedDate, tc.saledate) <= @IsTc12Or30  
  and   
  datediff(Day,pr.CSGLastChangedDate, tc.saledate) >= 0  
  /*and  
  convert(bigint, substring(pr.WoNumber , len(pr.WONumber) - 5 , len(pr.WoNumber))) < convert(bigint, substring(tc.WoNumber , len(tc.WONumber) - 5 , len(tc.WoNumber)))*/  
  and  
  CONVERT(bigint, pr.WONumber) < CONVERT(bigint, tc.WoNumber)  
  and oom.TechCode is null and tts.Supervisor like @supervisor and pr.TechCode <> 'retailer' and (select dbo.IsBucketNumber(pr.TechCode)) = 0  
  order by tdc.CUSTOMERID  
end  
  if(@TcOnTcMode = 1)  
  begin  
   delete from @TC where OrgWorkOrderType not in ('TC' , 'SC')  
  end  
  if(@IsPayrollMode = 1)  
  begin  
   delete @TC  
   from tbl_TC12 tc12  
   where tc12.TCWONumber = TCJob and tc12.IsCountedAgainstTech = 0  
     
   delete @TC  
   from tbl_data_job_setup tjs   
   where  
   TCJob = tjs.WoNumber  
   and  
   tjs.CSGStatus = 'X'  
   and  
   tjs.CSGLastCHangedDate < tjs.ScheduledDate  
  end  
    
  /*delete from @TC   
  from (select t.OrgJob as OrgJobFilter , MIN(convert(bigint, substring(t.TCJob , len(t.TCJob) - 5 , len(t.TCJob)))) as MinTCJob from @TC as t group by t.OrgJob having COUNT(t.OrgJob) > 1) as filter  
  where convert(bigint, substring(TCJob , len(TCJob) - 5 , len(TCjob))) > filter.MinTCJob and OrgJob = filter.OrgJobFilter */  
    
  /*delete from @TC   
  from (select t.OrgJob as OrgJobFilter , MIN(t.TCCreatedDate) as MinTCJobCreatedDate from @TC as t group by t.OrgJob having COUNT(t.OrgJob) > 1) as filter  
  where TCCreatedDate > filter.MinTCJobCreatedDate and OrgJob = filter.OrgJobFilter */  
    
  delete from @TC   
  from (select t.OrgJob as OrgJobFilter , MIN(convert(bigint, t.TCJob )) as MinTCJob from @TC as t  group by t.OrgJob having COUNT(t.OrgJob) > 1) as filter  
  where convert(bigint, TCJob) > convert(bigint,filter.MinTCJob) and OrgJob = filter.OrgJobFilter  
    
  
  /*delete from @TC  
  from (select t.TCJOb as TCJobFilter , max(convert(bigint, substring(t.OrgJob , len(t.OrgJob) - 5 , len(t.OrgJob)))) as MaxOrgJob from @TC as t group by t.TCJob having COUNT(t.TCjob) > 1) as filter  
  where convert(bigint, substring(OrgJob , len(OrgJob) - 5 , len(OrgJob))) < filter.MaxOrgJob and TCJob = filter.TCJobFilter*/   
    
  /*delete from @TC  
  from (select t.TCJOb as TCJobFilter , max(t.OrgCompletedDate) as MaxOrgJobCompletedDate from @TC as t group by t.TCJob having COUNT(t.TCjob) > 1) as filter  
  where OrgCompletedDate < filter.MaxOrgJobCompletedDate and TCJob = filter.TCJobFilter */  
    
  delete from @TC  
  from (select t.TCJOb as TCJobFilter , max(convert(bigint, t.OrgJob )) as MaxOrgJob from @TC as t group by t.TCJob having COUNT(t.TCjob) > 1) as filter  
  where convert(bigint, OrgJob) < convert(bigint,filter.MaxOrgJob) and TCJob = filter.TCJobFilter  
     
  /*delete @TC  
  from tbl_Data_Job_Setup tjs   
  where convert(bigint, substring(tjs.WONumber, len(tjs.WONumber)-5,len(tjs.WONumber)))  between convert(bigint, substring(OrgJob , len(OrgJob) - 5 , len(OrgJob))) and convert(bigint, substring(TCJob , len(TCJob) - 5 , len(TCJob)))  
  and tjs.csgStatus = 'C' and tjs.csglastchangedDate > @enddate and CustID = tjs.CustomerID  and tjs.WorkorderType not in ('TC' , 'SC') */  
    
  /*delete @TC  
  from tbl_Data_Job_Setup tjs   
  where tjs.CSGLastChangedDate between OrgCompletedDate and TCCreatedDate  
  and tjs.csgStatus = 'C' and tjs.csglastchangedDate > @enddate and CustID = tjs.CustomerID  and tjs.WorkorderType not in ('TC' , 'SC')*/  
    
  delete @TC  
  from tbl_Data_Job_Setup tjs   
  where convert(bigint,tjs.WONumber)  > convert(bigint,OrgJob ) and convert(bigint,tjs.WONumber) < convert(bigint, TCJob)  
  and tjs.csgStatus = 'C' and tjs.csglastchangedDate >= @enddate and CustID = tjs.CustomerID  and tjs.WorkorderType not in ('TC' , 'SC')   
    
  delete @TC  
  from tbl_Data_Job_Setup tjsInner  
  where tjsInner.CustomerID = CustID and  tjsInner.CSGLastChangedDate >= OrgCompletedDate and tjsInner.CSGLastChangedDate <= TCCreatedDate  
       and tjsInner.TechCode <> OrgTechCode and tjsInner.WONumber <> OrgJob and tjsInner.WONumber <> TCJob and tjsInner.CSGStatus = 'C'  
    
    
    
  update @TC  
 set OrgTechCode = tts.TechCode,  
 OrgTechName = tts.TechName,  
 Supervisor = tts.Supervisor  
   
   
 from tbl_Data_Job_Setup tjs,  
 tbl_ZIPtoSupervisor zts, tbl_TechtoSupervisor tts, tbl_TechtoSupervisor ttsSup  
 where  
 tjs.WONumber = OrgJob and   
 tjs.CustomerZip = zts.ZipCode and zts.Supervisor = tts.Supervisor   
 and dbo.IsBucketNumber(tts.TechCode) = 1 and OrgTechCode = '9999'and zts.Supervisor = ttsSup.TechCode  
   
 if(@Supervisor != '%') delete from @TC where Supervisor <> @Supervisor  
    
    
  select Supervisor , COUNT(TCJob) as CompletedCount from @TC where TCStatus = 'C'  group by Supervisor order by Supervisor asc