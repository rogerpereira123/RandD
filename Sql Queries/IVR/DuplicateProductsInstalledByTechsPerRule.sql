select
w.WoNumber , tl.ProductId , tdc.PHONE
from
tbl_Wo2InvTxn w 
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_Data_Job_Setup tjs on w.WoNumber = tjs.WONumber
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
inner join  tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_InvTxnOut2InUnit o2iu on o2iu.InvTxnLineOutId = tl.InvTxnLineId
inner join tbl_InvTxnUnit tu on o2iu.InvTxnUnitId = tu.InvTxnUnitId
inner join tbl_InvProductToPrefix ptp on tl.ProductId = ptp.ProductId
where
convert(date,t.CreatedDate) >= '01/01/2011'
and
ptp.Prefix in('WALN4','EALN4','SLNKA','SLANA','USBNA','OTAMD','DSCNA')
group by w.WoNumber , tl.ProductId , tdc.PHONE having COUNT( tu.SerialNo1) > 1




