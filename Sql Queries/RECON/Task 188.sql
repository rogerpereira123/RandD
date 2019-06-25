select distinct [Work Order No] as WoNumber , [Payment Amount] into #paid
from dishtest.dbo.par_t188 t188
inner join WOLabor on t188.epp_188_rsptech_WORK_ORDER_ID_CSG = wolabor.[Work Order No]


/*If Already Charged Back
select distinct [Work Order No] as WoNumber , [Payment Amount]
from dishtest.dbo.par_t188 t188
inner join WOLabor on t188.epp_188_rsptech_WORK_ORDER_ID_CSG = wolabor.[Work Order No]
where 
convert(varchar(10),[Payment Amount]) like '%(%'*/

--Reciovers RAed in Task 188
--Using RA #
select t188.*, ste.equipment , ratest.ra# , racr.[Payment Amount]
from 
dishtest.dbo.par_t188 t188, 
dishtest.dbo.sonumber so,
dishtest.dbo.ratest ratest left outer join Creditmemo racr on ratest.ra# = racr.[RA Number] , 
northware.dbo.tbl_StockNoToEquipment ste 
where 
t188.epp_188_rsptech_WORK_ORDER_ID_CSG = so.wo#
and
so.so# = ratest.so#
and
ratest.itemid  = ste.[item id]
and
ste.Type like '%REC%'
--Using WONumber
select t188.*, ste.equipment , ratest.ra# , racr.[Payment Amount]
from 
dishtest.dbo.par_t188 t188 left outer join dishtest.dbo.creditmemo racr
on t188.epp_188_rsptech_WORK_ORDER_ID_CSG = racr.[Work Order No],
dishtest.dbo.SoNumber so,
dishtest.dbo.ratest ratest,
northware.dbo.tbl_StockNoToEquipment ste 
where 
t188.epp_188_rsptech_WORK_ORDER_ID_CSG = so.wo#
and
ratest.so# = so.so#
and
ratest.itemid  = ste.[item id]
and
ste.Type like '%REC%'





drop table #beyond365

--NCs falling beyond 365 days
select 
distinct t188.* , #paid.[Payment Amount] , 'NO' as [Is Charged Back?] into #beyond365

from 
dishtest.dbo.par_t188 t188
left outer join #paid on t188.epp_188_rsptech_WORK_ORDER_ID_CSG = #paid.WoNumber,
northware.dbo.tbl_data_job_setup tjs1,
northware.dbo.tbl_data_job_setup tjs2
where
t188.epp_188_rsptech_WORK_ORDER_ID_CSG = tjs1.wonumber
and
tjs1.customerid = tjs2.customerid
and
tjs2.workordertype in ('NC' , 'RC' , 'RS')
and
tjs2.csgstatus = 'C'
and
(tjs1.SaleDate - tjs2.CSGLastChangedDate) > 365


select * from #beyond365 where
epp_188_rsptech_WORK_ORDER_ID_CSG not in 
(
select tt188.epp_188_rsptech_WORK_ORDER_ID_CSG ,tjs12.CSGStatus, tjs12.WONumber,tjs12.WorkOrderType
from
dishtest.dbo.par_t188 tt188,
northware.dbo.tbl_data_job_setup tjs11,
northware.dbo.tbl_data_job_setup tjs12
where 
tt188.epp_188_rsptech_WORK_ORDER_ID_CSG in 
(
	select #beyond365.epp_188_rsptech_WORK_ORDER_ID_CSG from #beyond365
)
and
tt188.epp_188_rsptech_WORK_ORDER_ID_CSG = tjs11.wonumber
and
tjs11.CustomerId = tjs12.CustomerId
and
tjs12.WorkOrderType in ('TC' , 'SC' , 'CH')
and
(tjs11.SaleDate - tjs12.CSGLastChangedDate) < 90
group by tt188.epp_188_rsptech_WORK_ORDER_ID_CSG
)




select * from #beyond365


update sonumber set SO# = replace(SO# , '"' , ''),Date = replace(Date , '"' , '') , WO# = replace(WO# , '"' , '') , Acct# = replace(Acct# , '"' , '')
update ratest set 
ra# = replace(RA# , '"' , ''),Date = replace(Date , '"' , '') , ItemId = replace(ItemId , '"' , '') , SO# = replace(So# , '"' , ''),
shippeddate = replace(shippeddate , '"' , '')

select * from wolabor where [work order no] = '43062722300000003'
select * from dishtest.dbo.par_t188 t188 where t188.epp_188_rsptech_WORK_ORDER_ID_CSG = '43062722300000003'


--Upgardes in Task 188
select t188.* from dishtest.dbo.par_T188 t188, northware.dbo.tbl_data_job_setup tjs 
where 
t188.epp_188_rsptech_WORK_ORDER_ID_CSG = tjs.wonumber
and
/*tjs.csglastchangeddate >= '01/01/2007'
and
tjs.csglastchangeddate <= '03/31/2007'
and*/
(
tjs.servicecodes like '%*G%' or
tjs.servicecodes like '%$.%' or
tjs.servicecodes like '%D!%' or
tjs.servicecodes like '%D(%' or
tjs.servicecodes like '%}O%' or
tjs.servicecodes like '%}P%' or
tjs.servicecodes like '%}Q%' or
tjs.servicecodes like '%}R%' or
tjs.servicecodes like '%J}%' or
tjs.servicecodes like '%I?%' or
tjs.servicecodes like '%X!%' or
tjs.servicecodes like '%X$%' or
tjs.servicecodes like '%X+%'
)
