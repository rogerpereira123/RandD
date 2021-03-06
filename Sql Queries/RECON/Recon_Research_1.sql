select sum(paymentamount) from tbl_DishPayment 
where 
convert(datetime,convert(varchar(10) , ClosedDate , 101) , 101) >= '04/01/2009'
and
convert(datetime,convert(varchar(10) , ClosedDate , 101) , 101) <= '04/30/2009'
and
TaskType = 'E'
and
WoNumber = '45660929100129011'


select p.wonumber ,p.closeddate, tjs.wonumber , tjs.csglastchangeddate from 
tbl_DishPayment p
inner join tbl_data_job_setup tjs on p.wonumber = tjs.wonumber
where
convert(varchar(10) , p.closeddate , 101) = '05/31/2009'
and 
tjs.csglastchangeddate <> convert(varchar(10) , p.closeddate , 101)

select * from tbl_data_job_setup where WoNumber = '45660929100129011'

select * from tbl_ExpectedWoLaborPayment where WONumber = '45660929100129011'
select * from tbl_ExpectedWoEquipmentPayment where WONumber = '45660929100129011'

select servicecode,TaskNumber, LaborReimAmount from tbl_ServiceCodetoTaskPayment
			where 
			'.D|<B|!7|!9|$9|{!|AA|IK|LC|P2|QM|R8|Y:|ZH|ZX|7P|$=|#X|AC|31|#$|CU|MB' like '%'+ServiceCode+'%'
			
			
select * from tbl_data_job_setup where csglastchangeddate = '06/15/2009' and CSGStatus = 'C'
delete  
tbl_WoReconMaster
from
tbl_WOReconMaster recon
left join tbl_TCSCPayment tc on recon.WoNumber = tc.WoNumber
 where recon.WoNumber not in (select WoNumber from tbl_ReconMaster)
and
recon.WOReconStatusId = 'WR0001'
and
isnull(tc.DishPayCode , '') <> 'NONBIL'
