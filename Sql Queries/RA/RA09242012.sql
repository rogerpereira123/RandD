
select W.WarehouseName, ISNULL(ste.ShortDesc, r.Name) as Product,  COUNT(r.workordernumber) as [Count]  from tbl_RAED r
inner join tbl_InvParticipant2User ip2u on ip2u.UserId = r.ReceivedBy
inner join tbl_Warehouse w on w.InvParticipantId = ip2u.InvParticipantId
left join tbl_StockNoToEquipment ste on r.StockNo = ste.[Item ID]
where r.IsReceived = 1 and r.Status = '010' and DATEDIFF(day, RMAReceivedDate , convert(date, getdate())) <= 21


group by w.WarehouseName,ISNULL(ste.ShortDesc, r.Name) having w.WarehouseName is not null
order by w.WarehouseName,ISNULL(ste.ShortDesc, r.Name) 




select  tjs.WONumber,tdc.NAME as Customer, tdc.PHONE, tjs.TechCode,tts.TechName, wTech.WarehouseName as TechWarehouse ,ISNULL(ste.ShortDesc, r.Name) as ProductName, r.IsReceived , r.ReceivedBy, w.WarehouseName as ReceivedAt , r.ReceivedByDate , r.DishRANumber , r.RMAReceivedDate , case when ttp.InvoiceClassId like '%o%' then 'YES' else 'NO' end as IsOutTech  
from tbl_RAED r
inner join tbl_InvParticipant2User ip2u on ip2u.UserId = r.ReceivedBy
inner join tbl_Warehouse w on w.InvParticipantId = ip2u.InvParticipantId
inner join tbl_Data_Job_Setup tjs on r.WorkOrderNumber = tjs.WONumber
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
left join tbl_TechToPayrollClass ttp on ttp.StartDate = '09/12/2012' and ttp.TechCode = tjs.TechCode
left join tbl_StockNoToEquipment ste on r.StockNo = ste.[Item ID]
inner join tbl_TechtoSupervisor tts on tjs.TechCode = tts.TechCode
inner join tbl_InvParticipant2User ip2uTech on ip2uTech.UserId = tjs.TechCode
inner join tbl_Warehouse wTech on ip2uTech.InvParticipantId = wTech.InvParticipantId
where r.IsReceived = 1 and r.Status = '010'  and DATEDIFF(day, RMAReceivedDate , convert(date, getdate())) <= 21

order by w.WarehouseName , tjs.TechCode , ISNULL(ste.ShortDesc, r.Name)