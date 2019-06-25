/*select
distinct tjs.WoNumber/*,tjs.WorkorderType, tjs.TechCode, /*tts.TechName,ttsSup.TechCode as Supervisor, ttsSup.TechName as SupervisorName,*/tdc.NAME as CustomerName,tdc.PHONE ,tdc.ADDRESS,tdc.CITY*/
from 
tbl_Wo2InvTxn w2i 
inner join tbl_InvTxn txn on w2i.InvTxnId = txn.InvTxnId
inner join tbl_InvTxnLine line on line.InvTxnId = txn.InvTxnId
inner join tbl_Product p on line.ProductId = p.ProductId
inner join tbl_Data_Job_Setup tjs on w2i.WoNumber = tjs.WONumber
--inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
--left join tbl_DishConnectivity dc on tjs.WONumber = dc.work_order_number
/*inner join tbl_TechtoSupervisor tts on tjs.TechCode = tts.TechCode
inner join tbl_TechtoSupervisor ttsSup on ttsSup.TechCode = tts.Supervisor*/
where
p.ProductId in ('157089','157087' , '141895' , '55-PX44')
and
tjs.CSGLastChangedDate >='09/13/2010'
and
 tjs.CSGLastChangedDate <='09/13/2010'
 /*and
 dc.work_order_number is null*/
 and
 tjs.WorkorderType in ('NC', 'RC' , 'RS')
 
 


select * from tbl_Data_Job_Setup tjs
inner join tbl_WOConnectivity woc on tjs.WONumber = woc.WONumber
where
WorkorderType in ('NC', 'RC' , 'RS')
and
CSGLastChangedDate >='09/13/2010'
and
CSGLastChangedDate <='09/13/2010'
and
CSGStatus in ('C' , 'D')
and
woc.Equipment = 'phone line'


select
* from 
 tbl_Data_Job_Setup tjs
 where
 WorkorderType in ('NC', 'RC' , 'RS')
and
CSGLastChangedDate >='09/13/2010'
and
CSGLastChangedDate <='09/13/2010'
and
CSGStatus in ('C' , 'D')*/

select
distinct tjs.WoNumber,tjs.WorkorderType, tjs.TechCode, tts.TechName,ttsSup.TechCode as Supervisor, ttsSup.TechName as SupervisorName,tdc.NAME as CustomerName,tdc.PHONE ,tdc.ADDRESS,tdc.CITY, p.ProductName as ConnectedWith
from 
tbl_Wo2InvTxn w2i 
inner join tbl_InvTxn txn on w2i.InvTxnId = txn.InvTxnId
inner join tbl_InvTxnLine line on line.InvTxnId = txn.InvTxnId
inner join tbl_Product p on line.ProductId = p.ProductId
inner join tbl_Data_Job_Setup tjs on w2i.WoNumber = tjs.WONumber
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
inner join tbl_DishConnectivity dc on tjs.WONumber = dc.work_order_number
--inner join TempConnect dc on dc.work_order_number = tjs.WONumber
inner join tbl_TechtoSupervisor tts on tjs.TechCode = tts.TechCode
inner join tbl_TechtoSupervisor ttsSup on ttsSup.TechCode = tts.Supervisor
where
p.ProductId in ('157089','157087' , '141895' , '55-PX44')
and
dc.last_changed_date >='09/01/2010'
and
dc.last_changed_date <='09/30/2010'
and
 dc.connected = 0 and dc.work_order_number not in (select work_order_number from tbl_DishConnectivity where  connected = 1)
 
 /*union
 
 select
distinct tjs.WoNumber,tjs.WorkorderType, tjs.TechCode, tts.TechName,ttsSup.TechCode as Supervisor, ttsSup.TechName as SupervisorName,tdc.NAME as CustomerName,tdc.PHONE ,tdc.ADDRESS,tdc.CITY, 'phone line' as ConnectedWith
from 
 tbl_Data_Job_Setup tjs
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
inner join tbl_DishConnectivity dc on tjs.WONumber = dc.work_order_number
--inner join TempConnect dc on dc.work_order_number = tjs.WONumber
inner join tbl_TechtoSupervisor tts on tjs.TechCode = tts.TechCode
inner join tbl_TechtoSupervisor ttsSup on ttsSup.TechCode = tts.Supervisor
where
 dc.work_order_number  in (select WONumber from tbl_WOConnectivity where Equipment in ('phone line' , 'ethernet'))
and 
dc.connected = 0 and dc.work_order_number not in (select work_order_number from tbl_DishConnectivity where  connected = 1)
and
dc.last_changed_date >='09/01/2010'
and
 dc.last_changed_date  <='09/30/2010'

order by Supervisor*/