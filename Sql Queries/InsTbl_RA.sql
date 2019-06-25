
insert into tbl_raed
select 
tjs.JobId,
1,
r.StockDescription,
null,
null,
r.TrackingNumber,
case when r.SvcOrderType = 'UPG' then 70
else 4
end,
0,
null,
null,
null,
null,
null,
0,
null
from 
raequip r
inner join sotowo s on r.sonumber = s.sonumber and r.TrackingNumber = s.TrackingNumber
inner join tbl_data_job_setup tjs on s.wonumber = tjs.wonumber
where
r.servicetech in ('1475' , '1889' , '2124' , '2344' , '3400')
