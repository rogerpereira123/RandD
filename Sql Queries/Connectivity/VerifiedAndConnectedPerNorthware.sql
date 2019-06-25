select
distinct vtc.work_order_number, tdc.NAME , tdc.ADDRESS , tdc.PHONE , tts.TechName as Supervisor, p.ProductName as ConnectedWith
from
tbl_DishConnectivity vtc
inner join tbl_Wo2InvTxn w2i on vtc.work_order_number = w2i.WoNumber
inner join tbl_Data_Job_Setup tjs on w2i.WoNumber = tjs.WONumber
inner join tbl_ZIPtoSupervisor tzs on tjs.CustomerZip = tzs.ZipCode
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
inner join tbl_TechtoSupervisor tts on tzs.Supervisor = tts.TechCode
inner join tbl_InvTxn txn on w2i.InvTxnId = txn.InvTxnId
inner join tbl_InvTxnLine line on line.InvTxnId = txn.InvTxnId
inner join tbl_Product p on line.ProductId = p.ProductId
where
p.ProductId in ('157089','157087' , '141895' , '55-PX44')

union

select
distinct vtc.work_order_number, tdc.NAME , tdc.ADDRESS , tdc.PHONE , tts.TechName as Supervisor,wc.Equipment as ConnectedWith
from
tbl_DishConnectivity vtc
inner join tbl_Data_Job_Setup tjs on vtc.work_order_number = tjs.WONumber
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
inner join tbl_ZIPtoSupervisor tzs on tjs.CustomerZip = tzs.ZipCode
inner join tbl_TechtoSupervisor tts on tzs.Supervisor = tts.TechCode
inner join tbl_WOConnectivity wc on tjs.WONumber = wc.WONumber
where
wc.Equipment in ('phone line' , 'ethernet')

order by Supervisor