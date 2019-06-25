declare @startDate date = '01/01/2015'
declare @EndDate date = '12/31/2015'
select distinct tjs.WONumber from tbl_Data_Job_Setup tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
left join (select distinct p.ProductId from tbl_Product p inner join tbl_EConnectModelToProductMapping etp on p.ProductId = etp.ProductId 
where etp.EConnectModel like '%vip%' and p.CategoryId = 4) rsc on p.ProductId = rsc.ProductId
left join tbl_InvTxnLine tl1 on tl.InvTxnId = tl1.InvTxnId and tl1.ProductId in (select p1.ProductId from tbl_Product p1 where p1.ProductName like '%hopper%' and p1.CategoryId = 4)
where WorkOrderType = 'NC' and ServiceCodes not like '%73%' and ServiceCodes not like '%-K%'
and p.ProductName not like '%hopper%' and p.ProductName not like '%joey%' and p.CategoryId = 4 
and rsc.ProductId is null
and tjs.CSGLastChangedDate between @startDate and @EndDate
and tjs.CSGStatus = 'C'
and tjs.WorkUnits > 0
and tl1.InvTxnLineId is null