declare @StartDate date = '02/01/2010'
declare @EndDate date = '02/28/2010'

declare @ProjectionStartDate date = '02/01/2013'
declare @ProjectionEndDate date = '02/28/2013'

declare @Stats table
(
[Year] int,
Location varchar(200),
Points int,
NumberOfJobs int
)
declare @MovingAverageCount int = 0
while(@MovingAverageCount <= 3)
begin
    
	insert into @Stats
	select DATEPART(YEAR  , @StartDate), w.WarehouseName, sum(tjs.WorkUnits), COUNT(tjs.WONumber) from 
	tbl_Data_Job_Setup tjs left join tbl_OutOfMarketTechs oom on tjs.TechCode = oom.TechCode
	inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
	inner join tbl_ZIPtoSupervisor zts on tdc.ZIPCODE = zts.ZipCode 
	inner join tbl_User usup on zts.Supervisor = usup.UserId
	inner join (select UserId,MAX(InvParticipantId) as InvParticipantId from tbl_InvParticipant2User group by UserId) ip2u on usup.UserId = ip2u.UserId
	inner join tbl_Warehouse w on ip2u.InvParticipantId = w.InvParticipantId
	where 
	--CSGLastChangedDate  >= @StartDate and CSGLastChangedDate <=@EndDate 
	ScheduledDate >= @StartDate and ScheduledDate <= @EndDate
	--and	dbo.IsBucketNumber(tjs.techCode) = 0 
	--and CSGStatus ='C'  
	--and oom.TechCode is null 
	and tjs.TechCode not like 'ret%' 
	--and tjs.TechCode <> '9999'
	--and (tjs.TechCode not in (seect distinct TechCode from tbl_TechToPayrollClass where InvoiceClassId in (select InvoiceClassId from tbl_InvoiceClassMaster where ClassName like '%contractor%')))
	group by w.WarehouseName
	--select DATEPART(YEAR , @StartDate), COUNT(distinct TechCode) as [2010] from tbl_Data_Job_Setup where CSGLastChangedDate  >= @StartDate and CSGLastChangedDate <=@EndDate and dbo.IsBucketNumber(techCode) = 0 and dbo.udf_IsContractor(techcode,0) = '' and CSGStatus ='C'

	set @StartDate = DATEADD(YEAR, 1 , @startdate)
	set @EndDate = DATEADD(YEAR , 1 , @EndDate)
	set @MovingAverageCount = @MovingAverageCount + 1
	

end


select Location,  AVG(Points) as Mean ,  round(STDEV(Points) , 0) as Deviation, round((AVG(points) + round(STDEV(Points) , 0)) / (DATEDIFF(day, @ProjectionStartDate , @ProjectionEndDate)+1) , 0) as AvgPointsPerDay , AVG(NumberOfJobs) as AvgJobs, STDEV(NumberOfJobs) as Deviation from @Stats where Year < 2013  group by Location 

select 
AVG(r.ToalPerYear) as Mean, STDEV(r.ToalPerYear) as Deviation from (
select [YEAR] , SUM(NumberOfJobs) ToalPerYear from @Stats group by [Year] having [Year] <> 2013) r 



select [YEAR] , SUM(NumberOfJobs) ToalPerYear from @Stats group by [Year] having [Year] = 2013
