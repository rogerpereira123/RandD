select
NC.Supervisor, NC.NCCount as 'Total NC Count' , NCNoVIP.NCNoVipCount as 'NC Jobs With No VIP Receiver' , 
NCFlex.NCFlexCount as 'NC With Flex Codes' ,NCFlexNoVip.NCFlexNoVipCount as 'NC With Flex Codes But No VIP Receiver'
from
(select 
zts.Supervisor, tts.TechName as SupervisorName  ,COUNT(tjs.WONumber) as NCCount 
from 
tbl_Data_Job_Setup tjs
inner join tbl_ZIPtoSupervisor zts on tjs.CustomerZip = zts.ZipCode
inner join tbl_TechtoSupervisor tts on zts.Supervisor = tts.TechCode
where
tjs.WorkorderType in ('NC' ,'RC' , 'RS')
and
tjs.CSGLastChangedDate >= '02/01/2011'
and
tjs.CSGLastChangedDate <= '02/28/2011'
group by zts.Supervisor, tts.TechName) as NC 
left join 
(select 
zts.Supervisor, tts.TechName as SupervisorName  ,COUNT(tjs.WONumber) as NCNoVipCount
from 
tbl_Data_Job_Setup tjs
inner join tbl_ZIPtoSupervisor zts on tjs.CustomerZip = zts.ZipCode
inner join tbl_TechtoSupervisor tts on zts.Supervisor = tts.TechCode
where
tjs.WorkorderType in ('NC' ,'RC' , 'RS')
and
tjs.CSGLastChangedDate >= '02/01/2011'
and
tjs.CSGLastChangedDate <= '02/28/2011'
and
tjs.ServiceCodes not like '%J3%' and tjs.ServiceCodes not like '%OV%' and tjs.ServiceCodes not like '%<:%'
and tjs.ServiceCodes not like '%CS%' and tjs.ServiceCodes not like '%T*%'

group by zts.Supervisor, tts.TechName) as NCNoVIP on NC.Supervisor = NCNoVip.Supervisor

left join
(select 
zts.Supervisor, tts.TechName as SupervisorName  ,COUNT(tjs.WONumber) as NCFlexCount
from 
tbl_Data_Job_Setup tjs
inner join tbl_ZIPtoSupervisor zts on tjs.CustomerZip = zts.ZipCode
inner join tbl_TechtoSupervisor tts on zts.Supervisor = tts.TechCode
where
tjs.WorkorderType in ('NC' ,'RC' , 'RS')
and
tjs.CSGLastChangedDate >= '02/01/2011'
and
tjs.CSGLastChangedDate <= '02/28/2011'
and
( tjs.ServiceCodes like '%:>%' or tjs.ServiceCodes like '%I;%' or tjs.ServiceCodes like '%NX%')
group by zts.Supervisor, tts.TechName) as NCFlex on Nc.Supervisor = NCFlex.Supervisor

left join 
(select 
zts.Supervisor, tts.TechName as SupervisorName  ,COUNT(tjs.WONumber) as NCFlexNoVipCount
from 
tbl_Data_Job_Setup tjs
inner join tbl_ZIPtoSupervisor zts on tjs.CustomerZip = zts.ZipCode
inner join tbl_TechtoSupervisor tts on zts.Supervisor = tts.TechCode
where
tjs.WorkorderType in ('NC' ,'RC' , 'RS')
and
tjs.CSGLastChangedDate >= '02/01/2011'
and
tjs.CSGLastChangedDate <= '02/28/2011'
and
( tjs.ServiceCodes like '%:>%' or tjs.ServiceCodes like '%I;%' or tjs.ServiceCodes like '%NX%')
and
tjs.ServiceCodes not like '%J3%' and tjs.ServiceCodes not like '%OV%' and tjs.ServiceCodes not like '%<:%'
and tjs.ServiceCodes not like '%CS%' and tjs.ServiceCodes not like '%T*%'
group by zts.Supervisor, tts.TechName) as NCFlexNoVip on NC.Supervisor = NCFlexNoVip.Supervisor