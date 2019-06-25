declare @StartDate date = '01/01/2012'
declare @EndDate date = '01/31/2012'
declare @Stats table
(

Location varchar(200),
[Date] date,
TechCount float,
PointsCompletedByTechs float,
ContractorCount float,
PointsCompletedByContractors float
)
declare @OrgStartDate date = @Startdate
while (@StartDate <= @EndDate)
begin

insert into @Stats 

select  w.WarehouseName,@StartDate,  count(distinct tjs.TechCode) , 0 , 0,0 from 
	tbl_Data_Job_Setup tjs left join tbl_OutOfMarketTechs oom on tjs.TechCode = oom.TechCode
	inner join tbl_ZIPtoSupervisor zts on tjs.CustomerZip = zts.ZipCode
	inner join (select UserId,MAX(InvParticipantId) as InvParticipantId from tbl_InvParticipant2User group by UserId) ip2uSup on ip2uSup.UserId = zts.Supervisor
	inner join tbl_Warehouse w on ip2uSup.InvParticipantId = w.InvParticipantId
	where CSGLastChangedDate  >= @StartDate and CSGLastChangedDate <= @StartDate
	and	dbo.IsBucketNumber(tjs.techCode) = 0 
	and CSGStatus ='C'  
	and oom.TechCode is null 
	and tjs.TechCode not like 'ret%' 
	and tjs.TechCode <> '9999'
	and (tjs.TechCode not in (select distinct TechCode from tbl_TechToPayrollClass where InvoiceClassId in (select InvoiceClassId from tbl_InvoiceClassMaster where ClassName like '%contractor%')))
	group by w.WarehouseName 
	
	
	update s
	set s.ContractorCount = js.ContractorCount
	from  @Stats s 
	inner join (
	select  w.WarehouseName, count(distinct tjs.TechCode) as ContractorCount   from 
	tbl_Data_Job_Setup tjs left join tbl_OutOfMarketTechs oom on tjs.TechCode = oom.TechCode
	inner join tbl_ZIPtoSupervisor zts on tjs.CustomerZip = zts.ZipCode
	inner join (select UserId,MAX(InvParticipantId) as InvParticipantId from tbl_InvParticipant2User group by UserId) ip2uSup on ip2uSup.UserId = zts.Supervisor
	inner join tbl_Warehouse w on ip2uSup.InvParticipantId = w.InvParticipantId
	where CSGLastChangedDate  >= @StartDate and CSGLastChangedDate <=@StartDate
	and	dbo.IsBucketNumber(tjs.techCode) = 0 
	and CSGStatus ='C'  
	and oom.TechCode is null 
	and tjs.TechCode not like 'ret%' 
	and tjs.TechCode <> '9999'
	and (tjs.TechCode in (select distinct TechCode from tbl_TechToPayrollClass where InvoiceClassId in (select InvoiceClassId from tbl_InvoiceClassMaster where ClassName like '%contractor%')))
	group by w.WarehouseName) js on s.Location = js.WarehouseName and s.Date = @StartDate
	
	update s
	set s.PointsCompletedByTechs = tjs.Points
	from  @Stats s 
	inner join (
	select w.WarehouseName, sum(tjs.WorkUnits) as Points from 
	tbl_Data_Job_Setup tjs left join tbl_OutOfMarketTechs oom on tjs.TechCode = oom.TechCode
	inner join tbl_ZIPtoSupervisor zts on tjs.CustomerZip = zts.ZipCode
	inner join (select UserId,MAX(InvParticipantId) as InvParticipantId from tbl_InvParticipant2User group by UserId) ip2uSup on ip2uSup.UserId = zts.Supervisor
	inner join tbl_Warehouse w on ip2uSup.InvParticipantId = w.InvParticipantId
	where CSGLastChangedDate  >= @StartDate and CSGLastChangedDate <=@StartDate
	and	dbo.IsBucketNumber(tjs.techCode) = 0 
	and CSGStatus ='C'  
	and oom.TechCode is null 
	and tjs.TechCode not like 'ret%' 
	and tjs.TechCode <> '9999'
	and (tjs.TechCode not in (select distinct TechCode from tbl_TechToPayrollClass where InvoiceClassId in (select InvoiceClassId from tbl_InvoiceClassMaster where ClassName like '%contractor%')))
	group by w.WarehouseName) tjs on s.Location = tjs.WarehouseName and s.Date = @StartDate
	
	update s
	set s.PointsCompletedByTechs = s.PointsCompletedByTechs + tjs.Points
	from  @Stats s 
	inner join (
	select w.WarehouseName, sum(tjs.Points) as Points from 
	InternalWorkOrder tjs left join tbl_OutOfMarketTechs oom on tjs.TechCode = oom.TechCode
	inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
	inner join tbl_ZIPtoSupervisor zts on tdc.ZIPCODE = zts.ZipCode
	inner join (select UserId,MAX(InvParticipantId) as InvParticipantId from tbl_InvParticipant2User group by UserId) ip2uSup on ip2uSup.UserId = zts.Supervisor
	inner join tbl_Warehouse w on ip2uSup.InvParticipantId = w.InvParticipantId
	where LastupdatedDt  >= @StartDate and LastupdatedDt <=@StartDate
	and	dbo.IsBucketNumber(tjs.techCode) = 0 
	and Status ='C'  
	and oom.TechCode is null 
	and tjs.TechCode not like 'ret%' 
	and tjs.TechCode <> '9999'
	and (tjs.TechCode not in (select distinct TechCode from tbl_TechToPayrollClass where InvoiceClassId in (select InvoiceClassId from tbl_InvoiceClassMaster where ClassName like '%contractor%')))
	group by w.WarehouseName) tjs on s.Location = tjs.WarehouseName and s.Date = @StartDate
	
	update s
	set s.PointsCompletedByContractors = tjs.Points
	from  @Stats s 
	inner join (
	select w.WarehouseName, sum(tjs.WorkUnits) as Points from 
	tbl_Data_Job_Setup tjs left join tbl_OutOfMarketTechs oom on tjs.TechCode = oom.TechCode
	inner join tbl_ZIPtoSupervisor zts on tjs.CustomerZip = zts.ZipCode
	inner join (select UserId,MAX(InvParticipantId) as InvParticipantId from tbl_InvParticipant2User group by UserId) ip2uSup on ip2uSup.UserId = zts.Supervisor
	inner join tbl_Warehouse w on ip2uSup.InvParticipantId = w.InvParticipantId
	where CSGLastChangedDate  >= @StartDate and CSGLastChangedDate <=@StartDate
	and	dbo.IsBucketNumber(tjs.techCode) = 0 
	and CSGStatus ='C'  
	and oom.TechCode is null 
	and tjs.TechCode not like 'ret%' 
	and tjs.TechCode <> '9999'
	and (tjs.TechCode in (select distinct TechCode from tbl_TechToPayrollClass where InvoiceClassId in (select InvoiceClassId from tbl_InvoiceClassMaster where ClassName like '%contractor%')))
	group by w.WarehouseName) tjs on s.Location = tjs.WarehouseName and s.Date = @StartDate
	
	update s
	set s.PointsCompletedByContractors = s.PointsCompletedByContractors + tjs.Points
	from  @Stats s 
	inner join (
	select w.WarehouseName, sum(tjs.Points) as Points from 
	InternalWorkOrder tjs left join tbl_OutOfMarketTechs oom on tjs.TechCode = oom.TechCode
	inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
	inner join tbl_ZIPtoSupervisor zts on tdc.ZIPCODE = zts.ZipCode
	inner join (select UserId,MAX(InvParticipantId) as InvParticipantId from tbl_InvParticipant2User group by UserId) ip2uSup on ip2uSup.UserId = zts.Supervisor
	inner join tbl_Warehouse w on ip2uSup.InvParticipantId = w.InvParticipantId
	where LastupdatedDt  >= @StartDate and LastupdatedDt <=@StartDate
	and	dbo.IsBucketNumber(tjs.techCode) = 0 
	and Status ='C'  
	and oom.TechCode is null 
	and tjs.TechCode not like 'ret%' 
	and tjs.TechCode <> '9999'
	and (tjs.TechCode in (select distinct TechCode from tbl_TechToPayrollClass where InvoiceClassId in (select InvoiceClassId from tbl_InvoiceClassMaster where ClassName like '%contractor%')))
	group by w.WarehouseName) tjs on s.Location = tjs.WarehouseName and s.Date = @StartDate
	
	set @StartDate = DATEADD(day , 1 , @StartDate)
	
end

declare @NumberOfDays int = DATEDIFF(day , @OrgStartDate, @endDate) + 1


select 	
Location , 
round(sum(TechCount) / @NumberOfDays,0) as AvgDailyTechCount,
round(sum(PointsCompletedByTechs / TechCount) / @NumberOfDays , 0) as [Avg Points Per Tech Per Day],
 round(sum(ContractorCount) / @NumberOfDays,0) as AvgDailyContractorCount,
  round(sum(case when ContractorCount = 0 then 0 else PointsCompletedByContractors / ContractorCount end) / @NumberOfDays , 0) as [Avg Points Per Contractor Per Day]

from @Stats group by Location