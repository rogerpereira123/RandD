declare @Reviews table
(
 ReviewId bigint,
 TechCode varchar(50),
 DateAdded datetime
)
insert into @Reviews
select distinct top 1  rm.ReviewId , rm.RevieweeUserId , rm.ReviewStartDateTime from tbl_ReviewSystem_ReviewMaster rm left join 
 tbl_ReviewSystem_ReviewToPerformanceParameters  rp on rm.ReviewId = rp.ReviewId
 where rp.ReviewId is null 
 
 declare @ReviewId bigint = 0
 declare @Tech varchar(50)
 declare @Date date
 while(exists(select * from @Reviews))
 begin
	select top 1 @ReviewId = ReviewId , @Tech = TechCode , @Date = CONVERT(date, DateAdded) from @Reviews
	declare @P table 
	(
		PerformanceParameterId bigint,
		PerformanceParameterName varchar(500),
		PerformanceParameterValue decimal(18,2),
		PerformanceParameterStartDate date,
		PerformanceParameterEndDate date
	)
	insert into @P
	exec usp_ReviewSystem_GetPerformanceParameters @tech, @Date
	
	select @ReviewId , PerformanceParameterId ,PerformanceParameterValue , PerformanceParameterStartDate , PerformanceParameterEndDate  from @P
	
	delete from @Reviews where ReviewId = @ReviewId
 end
 