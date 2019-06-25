select * from tbl_IVR_ClockOut where WorkOrderNumber = '45205000025389014'
select * from tbl_IVR_EquipmentUtilized where WorkOrderNumber = '45205000025389014'

select * from tbl_Wo2InvTxn where WoNumber = '43340883100009039'


select * from tbl_Wo2InvTxn w
inner join tbl_WOTimes wt on w.WoNumber = wt.WONumber
where wt.Clock_Out is null

select * from tbl_IVR_ClockOut where WorkOrderNumber = '45013281605162001'
select * from tbl_InvTxn where InvTxnId = 'H53030CN'
select * from tbl_IVR_EquipmentUtilized where WorkOrderNumber = '45013281605162001'
select * from tbl_Data_Job_Setup where WONumber = '45013281605162001'
select * from tbl_WOTimes where WONumber = '45013281605162001'
select * from tbl_WOConnectivity where WONumber = '45013281605162001'

update tbl_WOTimes set Clock_Out = '16:49' where WONumber = '43340883100009039'

select * from tbl_InvTxnLine where InvTxnId = 'H530308E'

update tbl_WOTimes set Clock_Out = '19:57' where WONumber = '45013281605162001'