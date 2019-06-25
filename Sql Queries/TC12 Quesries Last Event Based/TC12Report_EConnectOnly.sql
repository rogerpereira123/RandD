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
		
		delete from #tc 
		from (select t.OrgJob as OrgJobFilter , MIN(convert(bigint, substring(t.TCJob , len(t.TCJob) - 5 , len(t.TCJob)))) as MinTCJob from #tc as t group by t.OrgJob having COUNT(t.OrgJob) > 1) as filter
		where convert(bigint, substring(#tc.TCJob , len(#tc.TCJob) - 5 , len(#tc.TCjob))) > filter.MinTCJob and OrgJob = filter.OrgJobFilter 

		delete from #tc
		from (select t.TCJOb as TCJobFilter , max(convert(bigint, substring(t.OrgJob , len(t.OrgJob) - 5 , len(t.OrgJob)))) as MaxOrgJob from #tc as t group by t.TCJob having COUNT(t.TCjob) > 1) as filter
		where convert(bigint, substring(#tc.OrgJob , len(#tc.OrgJob) - 5 , len(#tc.OrgJob))) < filter.MaxOrgJob and #tc.TCJob = filter.TCJobFilter 
			
		delete #tc
		from tbl_Data_Job_Setup tjs 
		where convert(bigint, substring(tjs.WONumber, len(tjs.WONumber)-5,len(tjs.WONumber)))  between convert(bigint, substring(#tc.OrgJob , len(#tc.OrgJob) - 5 , len(#tc.OrgJob))) and convert(bigint, substring(#tc.TCJob , len(#tc.TCJob) - 5 , len(#tc.TCJob)))
		and tjs.csgStatus = 'C' and tjs.csglastchangedDate > @enddate and #tc.CustomerId = tjs.CustomerID  and tjs.WorkorderType not in ('TC' , 'SC')
		
		
		
		
		select * from #tc order by CustomerId
		
		select WONumber from tbl_Data_Job_Setup where CSGLastChangedDate >= @startDate and CSGLastChangedDate <= @endDate and CSGStatus = 'C'
		
		drop table #tc
		