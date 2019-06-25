declare @IsTc12Or30 int
set @IsTc12Or30 = 12
declare @startDate datetime
set @startDate = '12/09/2009'
declare @endDate datetime
set @endDate = '02/02/2010'
declare @techCode varchar(5)
set @techcode = '2766'



declare @ExternalTC12Count int
declare @ExternalIgnoreCount int
declare @InternalTC12Count float 
declare @InternalIgnoreCount int
declare @TotalCompletedJobsTC12 int
declare @TC1 table
(
 customerid bigint,
 techcode varchar(10),
 Status varchar(1),
 CreatedDate Datetime,
 WO varchar(20)
)
declare @TC table
(
 customerid bigint,
 techcode varchar(10),
 Status varchar(1),
 CreatedDate Datetime
)

set @ExternalTC12Count = 0
set @InternalTC12Count = 0
set @ExternalIgnorecount = 0
set @InternalIgnoreCount = 0

/*insert into @TC1
select  
--@ExternalTC12Count = isnull(count(tc.WoNumber) , 0)
tc.CustomerId,tc.TechCode , tc.CSGStatus as Status , tc.SaleDate as CreatedDate,tc.WoNumber as WO
from 
tbl_data_job_setup tc
inner join tbl_data_job_setup pr on tc.CustomerId = pr.CustomerId 
left join tbl_TC12 tc12 on (pr.wonumber = tc12.orgwonumber and tc.wonumber = tc12.tcwonumber)
where 
pr.CSGLastChangedDate >= @startDate
and
pr.CSGLastChangedDate <= @endDate
and
(tc.WorkorderType = 'TC' or tc.WorkorderType = 'SC')
and
pr.CSGStatus = 'C'
and
tc.wonumber <> pr.wonumber
and
datediff(Day,pr.CSGLastChangedDate, tc.saledate) <= @IsTc12Or30
and 
datediff(Day,pr.CSGLastChangedDate, tc.saledate) >= 0
and
pr.TechCode= @TechCode
and
isnull(tc12.IsCountedAgainstTech , 1) = 1 
--group by pr.TechCode having pr.TechCode = @techCode

--Per Tom Jobs Cancelled Prior to ScheduledDate should not be counted against Tech
delete @TC1
from tbl_data_job_setup tjs 
where
WO = tjs.WoNumber
and
tjs.CSGStatus = 'X'
and
tjs.CSGLastCHangedDate < tjs.ScheduledDate


select @ExternalTC12Count = count(*) from @TC1

insert into @TC
select CustomerId,TechCode , Status  , CreatedDate
from 
@TC1
where
CustomerId in (select CustomerId from @TC1 group by CustomerId having  count(CustomerId) > 1)
order by CreatedDate asc


select @ExternalIgnoreCount = count(*) 
from @TC where 
TechCode <> @TechCode
and
CreatedDate > (
select min(CreatedDate) from @TC
where TechCode <> @TechCode
and 
Status = 'C')

set @ExternalTC12Count = @ExternalTC12Count - @ExternalIgnoreCount

select * from @tc1
select @ExternalTC12Count as ExternalTC12Count

delete from @TC
delete from @TC1


if(@IsTc12Or30 = 12)
begin*/

		insert into @TC1
		select 
		--@InternalTC12Count = isnull(count(tc.WoNumber) , 0)
		tc.CustomerId,tc.TechCode , tc.Status , tc.CreatedDt as CreatedDate,tc.WoNumber as WO

		from 
		internalworkorder tc
		inner join tbl_data_job_setup pr on tc.Customerid = pr.CustomerId
		where 
		pr.CSGLastChangedDate >= @startDate
		and
		pr.CSGLastChangedDate <= @endDate
		and
		(tc.WorkorderType = 'IC' or tc.WorkorderType = 'TC' or tc.WorkorderType = 'SC' or tc.WorkorderType = 'HW')
		and
		pr.CSGStatus = 'C'
		and
		tc.status not in ('D' , 'X')
		and
		datediff(Day,pr.CSGLastChangedDate, tc.CreatedDt) <= @IsTc12Or30
		and 
		datediff(Day,pr.CSGLastChangedDate, tc.CreatedDt) >= 0
		and
		pr.TechCode= @TechCode
		--group by pr.TechCode having pr.TechCode = @techCode


		select @InternalTC12Count = count(*) from @TC1

		insert into @TC
		select CustomerId,TechCode , Status , CreatedDate
		from 
		@TC1
		where
		CustomerId in (select CustomerId from @tc1 group by CustomerId having  count(CustomerId) > 1)
		order by CreatedDate asc


		select @InternalIgnoreCount = count(*) 
		from @tc where 
		TechCode <> @TechCode
		and
		CreatedDate > (
		select min(CreatedDate) from @tc
		where TechCode <> @TechCode
		and 
		Status = 'C')

		set @InternalTC12Count = @InternalTC12Count - @InternalIgnoreCount

/*end


set @InternalTC12Count = @InternalTC12Count / 2

select @InternalTC12Count as InternalTC12Count
select * from @Tc1
select @TotalCompletedJobsTC12 = isnull(count(WoNumber) , 0)
from 
tbl_data_job_setup tjs
where
tjs.CSGLastChangeddate >= @startDate
and
tjs.CSGLastChangedDate <= @endDate
and
tjs.CSGStatus in ('C' ,'D')
group by tjs.TechCode having tjs.TechCode = @TechCode*/

select @TotalCompletedJobsTC12 =  isnull(count(WoNumber) , 0)
from 
internalworkorder tjs
where
tjs.LastUpdatedDt >= @startDate
and
tjs.LastUpdatedDt <= @endDate
and
tjs.status in ('C' )
group by tjs.TechCode having tjs.TechCode = @TechCode

declare @result float

select @InternalTC12Count
select @TotalCompletedJobsTC12


if(@TotalCompletedJobsTC12 = 0)
begin
	set @result = 0
end
else
begin
	set @result = (@InternalTC12Count / @TotalCompletedJobsTC12 ) * 100
end
select @result