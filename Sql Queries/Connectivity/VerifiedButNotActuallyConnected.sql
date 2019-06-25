select tvc.wo ,tdc.NAME as CustomerName, tdc.PHONE as CustomerPhone,  tzs.supervisor , tts.TechName as SupervisorName, isnull(tmr.ReasonDesc, '') , wc.OtherReason
from tempverifiedconnect tvc
inner join tbl_Data_Job_Setup tjs on tvc.wo = tjs.WONumber
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
inner join tbl_ZIPtoSupervisor tzs on tjs.CustomerZip = tzs.ZipCode
inner join tbl_TechtoSupervisor tts on tzs.Supervisor = tts.TechCode
inner join tbl_WOConnectivity wc on wc.WONumber = tjs.WONumber
left join tbl_Master_Reason tmr on wc.ReasonId = tmr.ReasonId

where tvc.wo not in
(select
vtc.wo
from
tempverifiedconnect vtc
inner join tbl_Wo2InvTxn w2i on vtc.wo = w2i.WoNumber
inner join tbl_InvTxn txn on w2i.InvTxnId = txn.InvTxnId
inner join tbl_InvTxnLine line on line.InvTxnId = txn.InvTxnId
inner join tbl_Product p on line.ProductId = p.ProductId
where
p.ProductId in ('157089','157087' , '141895' , '55-PX44')

union

select
vtc.wo
from
tempverifiedconnect vtc
where
vtc.wo  in (select WONumber from tbl_WOConnectivity where Equipment in ('phone line' , 'ethernet'))
)
order by tts.TechCode