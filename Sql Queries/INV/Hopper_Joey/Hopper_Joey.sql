select
tjs.CSGLastChangedDate as ClosedDate  , wh.WarehouseName, tjs.TechCode , w.WoNumber
into #temp
from
tbl_Wo2InvTxn w
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine l on t.InvTxnId = l.InvTxnId
inner join tbl_Data_Job_Setup tjs on w.WoNumber = tjs.WONumber
inner join tbl_InvParticipant2User ip2u on tjs.TechCode = ip2u.UserId
inner join tbl_Warehouse wh on ip2u.InvParticipantId = wh.InvParticipantId
where l.ProductId = '185647'

insert into #temp
select
tjs.LastupdatedDt as ClosedDate , wh.WarehouseName, tjs.TechCode , w.WoNumber
from
tbl_Wo2InvTxn w
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine l on t.InvTxnId = l.InvTxnId
inner join InternalWorkOrder tjs on w.WoNumber = tjs.WONumber
inner join tbl_InvParticipant2User ip2u on tjs.TechCode = ip2u.UserId
inner join tbl_Warehouse wh on ip2u.InvParticipantId = wh.InvParticipantId
where l.ProductId = '185647'

select ClosedDate , WarehouseName, TechCode , COUNT(Wonumber) as JobsCompletedWithHopper
from #temp
group by ClosedDate ,WarehouseName, TechCode 
order by ClosedDate , WarehouseName, TechCode

drop table #temp