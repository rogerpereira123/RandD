select distinct t315.work_order_id_csg as WONumber , ratest.RA#  , STE.Equipment, t315.origAmtPaid as 'Amt Paid as per T315' ,t315.wo_close_date 'WO Closed Date' , ratest.ShippedDate
from 
dishtest.dbo.PAR_T315 t315,
dishtest.dbo.ratest ratest, 
northware.dbo.tbl_StockNoToEquipment STE,
dishtest.dbo.SONumber SW,
northware.dbo.tbl_data_job_setup tjs 
where 
t315.work_order_id_csg = SW.WO#
and
SW.SO# = ratest.SO#
and
ratest.ItemId = STE.[Item Id] 
and 
( STE.Equipment like '%sw%' or STE.Equipment like '%ln%')
and 
t315.work_order_id_csg = tjs.WoNumber
/*and 
convert(datetime,convert(varchar(8) , ratest.shippeddate , 1) , 1) -  convert(datetime , convert(varchar(8) , tjs.csglastchangeddate , 1) , 1) <= 30*/
and 
ratest.shippeddate not like '%00%'



select * from par_t315 t315 
where 
/*t315.wo_close_date >= '01/01/2007'
and
t315.wo_close_date <= '03/31/2007'
and*/
t315.work_order_id_csg = '44131177600005014'


select * from tmp_racredit where ra_num = '18285865-002'






