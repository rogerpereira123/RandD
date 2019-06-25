select * from tbl_WOToOUPSStatus

declare @StartDate date = '12/01/2012'
declare @EndDate date = dateAdd(day , 6 , @StartDate)
declare @Report table ( StartDate date, EndDate date , Total int)


while (@EndDate <= '01/18/2013')
begin

	insert into @Report
	select @StartDate , @EndDate , COUNT(*) 
	from tbl_WOToOUPS 
	where Status in ('001' , '010')
	and CONVERT(date, REquestedDate) between @StartDate and @EndDate
	
	set @StartDate = DATEADD(day , 1 , @EndDate)
	set @EndDate = dateAdd(day , 6 , @StartDate)
	
end

select * from @Report