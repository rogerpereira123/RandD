declare @IsTc12Or30 int = 60
declare @startDate date = '03/15/2014'
declare @endDate date = '03/31/2014' 
declare @techCode varchar(5) = null 
declare @supervisor varchar(5) = null
declare @IsPayrollMode bit = 0
declare @TcOnTcMode bit = 0
--Please do not remove any fields as this SP is called in another stored procedure usp_GetTCJobs_LastEventBased
declare @TC table
(
CustID bigint,
CustomerName varchar(300),
TCJob varchar(20),
TCWorkOrderType  varchar(20),
TCTechCode varchar(50),
TCStatus varchar(10),
TCCreatedDate datetime,
TCCompletedDate datetime,
OrgJob varchar(20),
OrgWorkOrderType varchar(20),
OrgTechCode varchar(50),
OrgTechName varchar(300),
OrgStatus varchar(10),
OrgCreatedDate datetime,
OrgCompletedDate datetime,
Supervisor varchar(50)
)


if(@supervisor is null or @supervisor = '' or @supervisor = '-1') begin set @supervisor = '%' end
if(@techCode is not null and @techCode <> '')
begin
		insert into @TC
		select  
		tdc.CustomerID, tdc.Name as CustomerName,tc.WoNumber as 'TCJob',tc.WorkorderType as TCWorkOrderType, tc.TechCode as TCTechCode, tc.CSGStatus as TCStatus , tc.SaleDate as TCCreatedDate, tc.CSGLastChangedDate as TCCompletedDate, 
		pr.WONumber as OrgJob, pr.WorkorderType as OrgWorkOrderType,pr.TechCode as OrgTechCode,tts.TechName as OrgTechName,  pr.CSGStatus as OrgStatus, pr.SaleDate as OrgCreatedDate , pr.CSGLastChangedDate as OrgCompletedDate,tts.Supervisor
		 
		from 
		tbl_data_job_setup tc
		inner join tbl_data_job_setup pr on tc.CustomerId = pr.CustomerId 
		inner join tbl_data_customers tdc on tc.CustomerId = tdc.CustomerId
		inner join tbl_TechtoSupervisor tts on pr.TechCode = tts.TechCode
		where 
		pr.CSGLastChangedDate >= @startDate
		and
		pr.CSGLastChangedDate <= @endDate
		and
		tc.WorkorderType in ('TC' ,'SC')
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
		and pr.ServiceCodes like '%3-%'
		order by tdc.CUSTOMERID
		
		
end
else 
begin
		insert into @TC
		select  
		tdc.CustomerID, tdc.Name as CustomerName,tc.WoNumber as 'TCJob',tc.WorkorderType as TCWorkOrderType, tc.TechCode as TCTechCode, tc.CSGStatus as TCStatus , tc.SaleDate as TCCreatedDate, tc.CSGLastChangedDate as TCCompletedDate, 
		pr.WONumber as OrgJob, pr.WorkorderType as OrgWorkOrderType,pr.TechCode as OrgTechCode,tts.TechName as OrgTechName, pr.CSGStatus as OrgStatus, pr.SaleDate as OrgCreatedDate , pr.CSGLastChangedDate as OrgCompletedDate,ip2uSup.UserId as Supervisor
		 
		from 
		tbl_data_job_setup tc
		inner join tbl_data_job_setup pr on tc.CustomerId = pr.CustomerId 
		inner join tbl_data_customers tdc on tc.CustomerId = tdc.CustomerId
		inner join tbl_TechtoSupervisor tts on pr.TechCode = tts.TechCode
		left join tbl_OutOfMarketTechs oom on oom.TechCode = pr.TechCode
		inner join tbl_InvParticipant2User ip2u on pr.TechCode = ip2u.UserId
		inner join tbl_Warehouse w on w.InvParticipantId = ip2u.InvParticipantId
		inner join tbl_InvParticipant2User ip2uSup on ip2uSup.InvParticipantId = w.InvParticipantId
		inner join tbl_User u on ip2uSup.UserId = u.UserId
		where 
		pr.CSGLastChangedDate >= @startDate
		and
		pr.CSGLastChangedDate <= @endDate
		
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
		and oom.TechCode is null and ip2uSup.UserId like @supervisor and u.UserLevel = 2 and pr.TechCode not like 'ret%' and (select dbo.IsBucketNumber(pr.TechCode)) = 0 
		and 
		tc.WorkorderType in ('TC' ,'SC')
		and pr.ServiceCodes like '%3-%'
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
	tbl_ZIPtoSupervisor zts, tbl_TechtoSupervisor tts, tbl_InvParticipant2User ip2u ,
	tbl_Warehouse w, tbl_TechtoSupervisor ttsSup
	where
	tjs.WONumber = OrgJob and 
	tjs.CustomerZip = zts.ZipCode and zts.Supervisor = tts.Supervisor 
	and dbo.IsBucketNumber(tts.TechCode) = 1 and OrgTechCode = '9999' and ip2u.UserId = zts.Supervisor 
	and w.InvParticipantId = ip2u.InvParticipantId and zts.Supervisor = ttsSup.TechCode
	
	if(@Supervisor != '%') delete from @TC where Supervisor <> @Supervisor
		
		
		select distinct * from @TC where TCStatus =  'C'
		
		
		/*Compleed Jobs Count*/
	/*	select  count(tjs.WoNumber) as JobsCompleted from
tbl_Data_Job_Setup tjs inner join tbl_InvParticipant2User ip2u on tjs.TechCode = ip2u.UserId
inner join tbl_InvParticipant2User ip2uSup on ip2u.InvParticipantId = ip2uSup.InvParticipantId
inner join (select TechCode as Supervisor from tbl_TechtoSupervisor where TechCode = Supervisor) sup on sup.Supervisor = ip2uSup.UserId
left join tbl_OutOfMarketTechs oom on tjs.TechCode = oom.TechCode
where
tjs.CSGLastChangedDate >= @startDate and tjs.CSGLastChangedDate <= @endDate and tjs.CSGStatus = 'C'  and oom.TechCode is null
 and tjs.TechCode not like 'ret%' */
 
 