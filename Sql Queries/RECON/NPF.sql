--Is paid by dish?
--Using RAtest
select npf.* , crm.[Payment Amount] as 'Amt Paid(As per DD)' from 
par_npf npf
left outer join ratest on npf.[f ra] = ratest.ra#,
sonumber so,
creditmemo crm
where
ratest.so# = so.so#
and
so.wo# = crm.[Work order No]

--Using WoNumber 
select npf.* , crm.[Payment Amount] as 'Amt Paid(As per DD)' , crm.[Task Status] 'Task Status' from 
par_npf npf
left outer join wolabor crm on npf.X_WORK_ORDER_NUMBER = crm.[Work Order No]
where 
convert(varchar(10) , crm.[Payment Amount]) like '%-%'
or
convert(varchar(10) , crm.[Payment Amount]) like '%(%'



-------------------------------------------------------------------------
select * from creditmemo where [work order no] ='44830262000001035'
select count(*) from par_npf npf

-------------------------------------------------------------------------

select npf.* , ste.Equipment 
from 
par_NPF npf left outer join
ratest on npf.[f ra] = ratest.[ra#]
inner join northware.dbo.tbl_stockNoToequipment ste on ratest.ItemId = ste.[item id]
where
ste.type like '%rec%'

select count(*) from par_NPF


-------------------------------------------------------------------------
select npf.* from dishtest.dbo.par_npf npf, northware.dbo.tbl_data_job_setup tjs where 
npf.X_WORK_ORDER_NUMBER = tjs.wonumber
and
/*tjs.csglastchangeddate >= '01/01/2007'
and
tjs.csglastchangeddate <= '03/31/2007'
and*/
npf.X_WORK_ORDER_NUMBER not in
( 
--select npf.* , racr.[amount credited] as 'Amount Paid as per DD' , ste.Equipment , tjs1.csglastchangeddate 'ORG. Closed Date' ,  tjs2.saledate as 'TC Created Date'
select distinct npf.X_WORK_ORDER_NUMBER
from 
par_NPF npf , 
ratest,
northware.dbo.tbl_data_job_setup tjs1, 
northware.dbo.tbl_data_job_setup tjs2,
northware.dbo.tbl_stocknotoequipment ste
where 
npf.[f ra] = ratest.ra#
and
ratest.itemid = ste.[item id]
and
ste.type like '%rec%'
and
npf.X_WORK_ORDER_NUMBER = tjs1.WONumber
/*and
tjs1.csglastchangeddate >= '01/01/2007'
and
tjs1.csglastchangeddate <= '03/31/2007'*/
and
tjs1.customerid = tjs2.customerid
and
(tjs2.saledate - tjs1.csglastchangeddate) < 90
and
tjs2.saledate > tjs1.csglastchangeddate
and
tjs2.csgstatus = 'C'

)


--how many are upgrade
select npf.* from dishtest.dbo.par_npf npf, northware.dbo.tbl_data_job_setup tjs 
where 
npf.X_WORK_ORDER_NUMBER = tjs.wonumber
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








