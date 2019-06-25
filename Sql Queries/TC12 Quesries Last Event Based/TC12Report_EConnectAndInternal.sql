		declare @startDate datetime = '06/01/2011'
		declare @endDate datetime = '06/30/2011'
		declare @Supervisor varchar(50) = '%'
		select  
		--@ExternalTC12Count = isnull(count(tc.WoNumber) , 0)
		tdc.CustomerID, tdc.Name as CustomerName,tc.WoNumber as 'TCJob',tc.WorkorderType as TCWorkOrderType, tc.TechCode as TechCode, tc.CSGStatus as TCStatus , tc.SaleDate as TCCreatedDate, tc.CSGLastChangedDate as TCCompletedDate, pr.TechCode as OrgTech, pr.WONumber as OrgJob,pr.WorkorderType as OrgWorkOrderType
		 , pr.CSGLastChangedDate as OrgCompletedDate,tts.Supervisor
		 into #tc
		from 
		tbl_data_job_setup tc
		inner join tbl_data_job_setup pr on tc.CustomerId = pr.CustomerId 
		inner join tbl_data_customers tdc on tc.CustomerId = tdc.CustomerId
		inner join tbl_TechtoSupervisor tts on pr.TechCode = tts.TechCode
		left join tbl_OutOfMarketTechs oom on oom.TechCode = pr.TechCode
		where 
		pr.CSGLastChangedDate >= @startDate
		and
		pr.CSGLastChangedDate <= @endDate
		and
		(tc.WorkorderType in ('TC' ,'SC'))
		and
		pr.CSGStatus = 'C'
		and
		tc.wonumber <> pr.wonumber
		and
		datediff(Day,pr.CSGLastChangedDate, tc.saledate) <= 12
		and 
		datediff(Day,pr.CSGLastChangedDate, tc.saledate) >= 0
		and
		convert(bigint, substring(pr.WoNumber , len(pr.WONumber) - 5 , len(pr.WoNumber))) < convert(bigint, substring(tc.WoNumber , len(tc.WONumber) - 5 , len(tc.WoNumber)))
		and oom.TechCode is null 
		order by tdc.CUSTOMERID
		
		
		/******* Include Internal Trouble Calls *********/
		--Step 1 -> 12 Day HWTC On EConnect Jobs
		insert into #tc
		select  
		--@ExternalTC12Count = isnull(count(tc.WoNumber) , 0)
		tdc.CustomerID, tdc.Name as CustomerName,tc.WoNumber as 'TCJob',tc.WorkorderType as TCWorkOrderType, tc.TechCode as TechCode, tc.Status as TCStatus , tc.CreatedDt as TCCreatedDate, tc.LastupdatedDt as TCCompletedDate, pr.TechCode as OrgTech, pr.WONumber as OrgJob,pr.WorkorderType as OrgWorkOrderType
		 , pr.CSGLastChangedDate as OrgCompletedDate,tts.Supervisor
		 
		from 
		InternalWorkOrder tc
		inner join tbl_data_job_setup pr on tc.CustomerId = pr.CustomerId 
		inner join tbl_data_customers tdc on tc.CustomerId = tdc.CustomerId
		inner join tbl_TechtoSupervisor tts on pr.TechCode = tts.TechCode
		left join tbl_OutOfMarketTechs oom on oom.TechCode = pr.TechCode
		where 
		pr.CSGLastChangedDate >= @startDate
		and
		pr.CSGLastChangedDate <= @endDate
		and
		(tc.WorkorderType in ('HW'))
		and
		pr.CSGStatus = 'C'
		and
		tc.wonumber <> pr.wonumber
		and
		datediff(Day,pr.CSGLastChangedDate, tc.CreatedDt) <= 12
		and 
		datediff(Day,pr.CSGLastChangedDate, tc.CreatedDt) >= 0
		and oom.TechCode is null 
		order by tdc.CUSTOMERID
		
	  --Step 2 -> 12 Day Econnect Job On HWTC
	  insert into #tc
	  	select	tdc.CustomerID, tdc.Name as CustomerName,tc.WoNumber as 'TCJob',tc.WorkorderType as TCWorkOrderType, tc.TechCode as TechCode, tc.CSGStatus as TCStatus , tc.SaleDate as TCCreatedDate, tc.CSGLastChangedDate as TCCompletedDate, pr.TechCode as OrgTech, pr.WONumber as OrgJob,pr.WorkorderType as OrgWorkOrderType
		 , pr.LastupdatedDt as OrgCompletedDate,tts.Supervisor
		 
		from 
		tbl_Data_Job_Setup tc
		inner join InternalWorkOrder pr on tc.CustomerId = pr.CustomerId 
		inner join tbl_data_customers tdc on tc.CustomerId = tdc.CustomerId
		inner join tbl_TechtoSupervisor tts on pr.TechCode = tts.TechCode
		left join tbl_OutOfMarketTechs oom on oom.TechCode = pr.TechCode
		where 
		pr.LastupdatedDt >= @startDate
		and
		pr.LastupdatedDt <= @endDate
		and
		(tc.WorkorderType in ('TC' , 'SC'))
		and
		pr.Status = 'C'
		and
		tc.wonumber <> pr.wonumber
		and
		datediff(Day,pr.LastupdatedDt, tc.SaleDate) <= 12
		and 
		datediff(Day,pr.LastupdatedDt, tc.SaleDate) >= 0
		and oom.TechCode is null 
		order by tdc.CUSTOMERID
		
		--Step 3 -> 12 Day Hwtc on HWTC
		insert into #tc
		select	tdc.CustomerID, tdc.Name as CustomerName,tc.WoNumber as 'TCJob',tc.WorkorderType as TCWorkOrderType, tc.TechCode as TechCode, tc.Status as TCStatus , tc.CreatedDt as TCCreatedDate, tc.LastupdatedDt as TCCompletedDate, pr.TechCode as OrgTech, pr.WONumber as OrgJob,pr.WorkorderType as OrgWorkOrderType
		 , pr.LastupdatedDt as OrgCompletedDate,tts.Supervisor
		 
		from 
		InternalWorkOrder tc
		inner join InternalWorkOrder pr on tc.CustomerId = pr.CustomerId 
		inner join tbl_data_customers tdc on tc.CustomerId = tdc.CustomerId
		inner join tbl_TechtoSupervisor tts on pr.TechCode = tts.TechCode
		left join tbl_OutOfMarketTechs oom on oom.TechCode = pr.TechCode
		where 
		pr.LastupdatedDt >= @startDate
		and
		pr.LastupdatedDt <= @endDate
		and
		(tc.WorkorderType in ('HW'))
		and
		pr.Status = 'C'
		and
		tc.wonumber <> pr.wonumber
		and
		datediff(Day,pr.LastupdatedDt, tc.CreatedDt) <= 12
		and 
		datediff(Day,pr.LastupdatedDt, tc.CreatedDt) >= 0
		and oom.TechCode is null 
		order by tdc.CUSTOMERID
		
		
		
		
		--select * from #tc order by CustomerId
		
		
		delete from #tc
		from (select t.OrgJob as OrgJobFilter , MIN(CONVERT(date, t.TCCreatedDate,101)) as MinTCCreateDate from #tc as t group by t.OrgJob having COUNT(t.OrgJob) > 1) as filter
		where convert(date,#tc.TCCreatedDate,101) > filter.MinTCCreateDate and #tc.OrgJob = filter.OrgJobFilter 
		
		delete from #tc
		from (select t.TCJOB as TCJobFilter , max(CONVERT(date,t.OrgCompletedDate,101)) as MaxOrgCompletedDate from #tc as t group by t.TCJob having COUNT(t.TCJob) > 1) as filter
		where convert(date,#tc.OrgCompletedDate,101) < filter.MaxOrgCompletedDate and #tc.TCJOb = filter.TCJobFilter 
		
		/*delete from #tc 
		from (select t.OrgJob as OrgJobFilter , MIN(convert(bigint, substring(t.TCJob , len(t.TCJob) - 5 , len(t.TCJob)))) as MinTCJob from #tc as t group by t.OrgJob having COUNT(t.OrgJob) > 1) as filter
		where convert(bigint, substring(#tc.TCJob , len(#tc.TCJob) - 5 , len(#tc.TCjob))) > filter.MinTCJob and OrgJob = filter.OrgJobFilter 

		delete from #tc
		from (select t.TCJOb as TCJobFilter , max(convert(bigint, substring(t.OrgJob , len(t.OrgJob) - 5 , len(t.OrgJob)))) as MaxOrgJob from #tc as t group by t.TCJob having COUNT(t.TCjob) > 1) as filter
		where convert(bigint, substring(#tc.OrgJob , len(#tc.OrgJob) - 5 , len(#tc.OrgJob))) < filter.MaxOrgJob and #tc.TCJob = filter.TCJobFilter */
			
		delete #tc
		from tbl_Data_Job_Setup tjs 
		where convert(bigint, substring(tjs.WONumber, len(tjs.WONumber)-5,len(tjs.WONumber)))  between convert(bigint, substring(#tc.OrgJob , len(#tc.OrgJob) - 5 , len(#tc.OrgJob))) and convert(bigint, substring(#tc.TCJob , len(#tc.TCJob) - 5 , len(#tc.TCJob)))
		and tjs.csgStatus = 'C' and tjs.csglastchangedDate > @enddate and #tc.CustomerId = tjs.CustomerID  and tjs.WorkorderType not in ('TC' , 'SC')
		
		
		
		
		select * from #tc order by CustomerId
		/*select WONumber from tbl_Data_Job_Setup where CSGLastChangedDate >= @startDate and CSGLastChangedDate <= @endDate and CSGStatus = 'C'
		union
		select WONumber from InternalWorkOrder where LastupdatedDt >= @startDate and LastupdatedDt <= @endDate and Status = 'C'*/
		
		
		drop table #tc
		
		
	/*select WONumber ,TechCode, WorkorderType, ScheduledDate , CSGLastChangedDate , CSGStatus  from tbl_Data_Job_Setup
	where CSGLastChangedDate >= @startDate
	and CSGLastChangedDate <= @endDate
	/*and
	WorkorderType in ('TC' )*/
	and CSGStatus in ('C' , 'D') 
	and TechCode not like 'ret%'
	and TechCode not in (select TechCode from tbl_OutOfMarketTechs)*/