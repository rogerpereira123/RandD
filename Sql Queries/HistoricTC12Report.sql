
select distinct tjs.techcode
into #techs
from 
tbl_data_job_setup tjs
where
tjs.CSGLastChangedDate > '02/01/2009'
and
tjs.CSGLastChangedDate <= '02/28/2009'


select 
techcode ,( dbo.udf_GetTCCountForHourlyPayroll(12 , '09/01/2008' , '09/30/2008' , techcode) / dbo.udf_GetCompletedJobsCount('09/01/2008' , '09/30/2008' , techcode) * 100) as 'TC%'
into #September
from 
#techs

select * from #September where [TC%] is not null

select 
techcode , (dbo.udf_GetTCCountForHourlyPayroll(12 , '10/01/2008' , '10/31/2008' , techcode) / dbo.udf_GetCompletedJobsCount('10/01/2008' , '10/31/2008' , techcode))   * 100 as 'TC%'
into #October
from 
#techs

select * from #October where [TC%] is not null



select 
techcode , dbo.udf_GetTCCountForHourlyPayroll(12 , '11/01/2008' , '11/30/2008' , techcode) / dbo.udf_GetCompletedJobsCount('11/01/2008' , '11/30/2008' , techcode) * 100 as 'TC%'
into #November
from 
#techs
select * from #November where [TC%] is not null

select 
techcode , dbo.udf_GetTCCountForHourlyPayroll(12 , '12/01/2008' , '12/31/2008' , techcode) / dbo.udf_GetCompletedJobsCount('12/01/2008' , '12/31/2008' , techcode) * 100 as 'TC%'
into #December
from 
#techs

select * from #December where [TC%] is not null

select 
techcode , dbo.udf_GetTCCountForHourlyPayroll(12 , '02/01/2009' , '02/28/2009' , techcode) / dbo.udf_GetCompletedJobsCount('02/01/2009' , '02/28/2009' , techcode) * 100 as 'TC%'
into #Feb
from 
#techs
select * from #Feb where [TC%] is not null
