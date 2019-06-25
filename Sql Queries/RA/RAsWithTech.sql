select StockNo , Name , count(StockNo)
from tbl_raed 
ra inner join tbl_data_job_setup tjs on ra.WorkOrderNumber = tjs.WoNumber
where
tjs.CSGLastChangedDate >= '02/15/2009'
and
ra.IsReceived = 0
group by ra.StockNo,ra.Name  