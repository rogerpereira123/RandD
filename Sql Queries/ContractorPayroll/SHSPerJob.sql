declare @t tvp_PerformanceMetricsReport
insert into @t
select 'carlos.rios' ,  '' , '' , '' , '' , '' , 0,0,0,0,0,0,0,0,0
exec usp_PerformanceMetrics_SHS '11/01/2014' , '11/15/2014' , '' ,@t
