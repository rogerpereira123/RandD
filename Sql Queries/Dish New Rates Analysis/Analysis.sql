declare @t table (WONumber varchar(20) , WorkOrderType varchar(10) , ServiceCodes varchar(2000), ProductId varchar(200) , ProductName varchar(500) , Quantity int, IsVIP bit)
declare @r table (Configuration varchar(200), NewRate float , NumberOfJobs int)

insert into @r 
select Configuration , NewRate, 0 from ServiceCodeMapping

insert into @t
select
tjs.WONumber , tjs.WorkorderType,tjs.ServiceCodes, p.ProductId, p.ProductName, SUM(tl.Quantity) , 0
from tbl_Data_Job_Setup tjs
inner join tbl_Wo2InvTxn w on tjs.WONumber = w.WoNumber
inner join tbl_InvTxn t on w.InvTxnId = t.InvTxnId
inner join tbl_InvTxnLine tl on t.InvTxnId = tl.InvTxnId
inner join tbl_Product p on tl.ProductId = p.ProductId
where
p.CategoryId = 4 
and tjs.CSGLastChangedDate between '12/01/2014' and '12/10/2014'
group by tjs.WONumber, tjs.WorkorderType, tjs.ServiceCodes , p.ProductId, p.ProductName

update t
set
t.IsVIP = 1
from @t t
inner join tbl_ReconServiceCodeGrid rsc on t.ProductId = rsc.StockNo
where rsc.Description like '%vip%'



/**NC Section ****/
update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select COUNT (distinct t1.WONumber) as JobsCount from @t t1 left join @t t2 on t1.WONumber = t2.WONumber and t2.ProductName like '%joey%'
 left join @t t4 on t1.WONumber = t4.WONumber and t4.ServiceCodes like '%-K%'
where t1.ProductName like '%hopper%' and t1.WorkOrderType = 'NC' and t1.Quantity = 1
and  t2.WONumber is null and t4.WONumber is null) as d

where r.Configuration = 'NC - Hopper' 



update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select COUNT (distinct t1.WONumber) as JobsCount 
from @t t1 inner join @t t2 on t1.WONumber = t2.WONumber and t2.ProductId = '187894'
left join @t t3 on t1.WONumber = t3.WONumber and t3.ProductId  in ('199924' , '200438' , '203904' )
left join @t t4 on t1.WONumber = t4.WONumber and t4.ServiceCodes like '%-K%'
where t1.ProductName like '%hopper%' and t1.WorkOrderType = 'NC' and t1.Quantity = 1
and t2.Quantity= 1 and t3.WONumber is null and t4.WONumber is null
) as d
where r.Configuration = 'NC - Hopper with Joey' 

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select COUNT (distinct t1.WONumber) as JobsCount 
from @t t1 inner join @t t2 on t1.WONumber = t2.WONumber and t2.ProductId = '199924'
left join @t t3 on t1.WONumber = t3.WONumber and t3.ProductId  in ('187894' , '200438' , '203904' )
left join @t t4 on t1.WONumber = t4.WONumber and t4.ServiceCodes like '%-K%'
where t1.ProductName like '%hopper%' and t1.WorkOrderType = 'NC' and t1.Quantity = 1
and t2.Quantity= 1 and t3.WONumber is null and t4.WONumber is null
) as d
where r.Configuration = 'NC - Hopper with Wireless' 

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select COUNT (distinct t1.WONumber) as JobsCount 
from @t t1 inner join @t t2 on t1.WONumber = t2.WONumber and t2.ProductId in ('203904' , '200438')
left join @t t3 on t1.WONumber = t3.WONumber and t3.ProductId  in ('187894' , '199924' )
left join @t t4 on t1.WONumber = t4.WONumber and t4.ServiceCodes like '%-K%'
where t1.ProductName like '%hopper%' and t1.WorkOrderType = 'NC' and t1.Quantity = 1
and t2.Quantity= 1 and t3.WONumber is null and t4.WONumber is null
) as d
where r.Configuration = 'NC- Hopper with Super' 

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
(select COUNT (distinct t1.WONumber) as JobsCount from @t t1 left join @t t2 on t1.WONumber = t2.WONumber and t2.IsVIP = 1
left join @t t4 on t1.WONumber = t4.WONumber and t4.ServiceCodes like '%-K%'
where t1.IsVIP = 1 and t1.WorkOrderType = 'NC' and t1.Quantity = 1 and t4.WONumber is null
and  t2.WONumber is null) as d
where r.Configuration = 'NC - VIP 1 Receiver' 

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
(select count(vips.WONumber) as JobsCount from 
(
select 
WONumber , SUM(Quantity) VipCount
from
@t where IsVIP = 1 and WorkOrderType = 'NC' group by WONumber ) as vips 
where VipCount = 2) as d
where r.Configuration = 'NC - VIP 2 Receiver' 

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
(select count(vips.WONumber) as JobsCount from 
(
select 
WONumber , SUM(Quantity) VipCount
from
@t where IsVIP = 1 and WorkOrderType = 'NC' group by WONumber ) as vips 
where VipCount = 3) as d
where r.Configuration = 'NC - VIP 3 Receiver' 

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
(select count(vips.WONumber) as JobsCount from 
(
select 
WONumber , SUM(Quantity) VipCount
from
@t where IsVIP = 1 and WorkOrderType = 'NC' group by WONumber ) as vips 
where VipCount = 4) as d
where r.Configuration = 'NC - VIP 4 Receiver' 


/**NC Section ****/

/** CH Section ***/


update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select COUNT (distinct t1.WONumber) as JobsCount 
from @t t1 left join @t t2 on t1.WONumber = t2.WONumber and t2.ProductName like '%joey%'
where t1.ProductName like '%hopper%' and t1.WorkOrderType = 'CH' and t1.ServiceCodes not like '%73%' and t1.Quantity = 1
and t2.WONumber is null
) as d
where r.Configuration = 'CH - Hopper' 

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select COUNT (distinct t1.WONumber) as JobsCount 
from @t t1 left join @t t2 on t1.WONumber = t2.WONumber and t2.ProductName like '%hopper%'
left join @t t3 on t1.WONumber = t3.WONumber and t3.ProductId  in ('199924' , '200438' , '203904' )
where t1.ProductId = '187894' and t1.WorkOrderType = 'CH' and t1.ServiceCodes not like '%73%' and t1.Quantity = 1
and t2.WONumber is null and t3.WONumber is null
) as d
where r.Configuration = 'CH -Joey' 

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select COUNT (distinct t1.WONumber) as JobsCount 
from @t t1 left join @t t2 on t1.WONumber = t2.WONumber and t2.ProductName like '%hopper%'
left join @t t3 on t1.WONumber = t3.WONumber and t3.ProductId  in ('187894' , '200438' , '203904' )
where t1.ProductId = '199924' and t1.WorkOrderType = 'CH' and t1.ServiceCodes not like '%73%' and t1.Quantity = 1
and t2.WONumber is null and t3.WONumber is null
) as d
where r.Configuration = 'CH - Wireless Joey' 

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select COUNT (distinct t1.WONumber) as JobsCount 
from @t t1 left join @t t2 on t1.WONumber = t2.WONumber and t2.ProductName like '%hopper%'
left join @t t3 on t1.WONumber = t3.WONumber and t3.ProductId  in ('187894' , '199924' )
where t1.ProductId in ('203904' , '200438') and t1.WorkOrderType = 'CH' and t1.ServiceCodes not like '%73%' and t1.Quantity = 1
and t2.WONumber is null and t3.WONumber is null
) as d
where r.Configuration = 'CH - Super Joey'

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select COUNT (distinct t1.WONumber) as JobsCount 
from @t t1 inner join @t t2 on t1.WONumber = t2.WONumber and t2.ProductId = '187894'
left join @t t3 on t1.WONumber = t3.WONumber and t3.ProductId  in ('199924' , '200438' , '203904' )
where t1.ProductName like '%hopper%' and t1.WorkOrderType = 'CH' and t1.ServiceCodes not like '%73%' and t1.Quantity = 1
and t2.Quantity = 1 and t3.WONumber is null
) as d
where r.Configuration = 'CH - Hopper with Joey'

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select COUNT (distinct t1.WONumber) as JobsCount 
from @t t1 inner join @t t2 on t1.WONumber = t2.WONumber and t2.ProductId = '199924'
left join @t t3 on t1.WONumber = t3.WONumber and t3.ProductId in ('187894' , '200438' , '203904' )
where t1.ProductName like '%hopper%' and t1.WorkOrderType = 'CH' and t1.ServiceCodes not like '%73%' and t1.Quantity = 1
and t2.Quantity = 1 and t3.WONumber is null
) as d
where r.Configuration = 'CH - Hopper with Wireless'

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select COUNT (distinct t1.WONumber) as JobsCount 
from @t t1 inner join @t t2 on t1.WONumber = t2.WONumber and t2.ProductId in ('203904' , '200438')
left join @t t3 on t1.WONumber = t3.WONumber and t3.ProductId in ('187894' , '199924' )
where t1.ProductName like '%hopper%' and t1.WorkOrderType = 'CH' and t1.ServiceCodes not like '%73%' and t1.Quantity = 1
and t2.Quantity = 1 and t3.WONumber is null
) as d
where r.Configuration = 'CH -Hopper with Super'


update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
(select count(vips.WONumber) as JobsCount from 
(
select 
WONumber , SUM(Quantity) VipCount
from
@t where IsVIP = 1 and WorkOrderType = 'CH' and ServiceCodes not like '%73%' group by WONumber ) as vips 
where VipCount = 1) as d
where r.Configuration = 'CH - VIP 1 Receiver' 

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
(select count(vips.WONumber) as JobsCount from 
(
select 
WONumber , SUM(Quantity) VipCount
from
@t where IsVIP = 1 and WorkOrderType = 'CH' and ServiceCodes not like '%73%' group by WONumber ) as vips 
where VipCount = 2) as d
where r.Configuration = 'CH - VIP 2 Receiver' 

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
(select count(vips.WONumber) as JobsCount from 
(
select 
WONumber , SUM(Quantity) VipCount
from
@t where IsVIP = 1 and WorkOrderType = 'CH' and ServiceCodes not like '%73%' group by WONumber ) as vips 
where VipCount = 3) as d
where r.Configuration = 'CH - VIP 3 Receiver' 

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
(select count(vips.WONumber) as JobsCount from 
(
select 
WONumber , SUM(Quantity) VipCount
from
@t where IsVIP = 1 and WorkOrderType = 'CH' and ServiceCodes not like '%73%' group by WONumber ) as vips 
where VipCount = 4) as d
where r.Configuration = 'CH - VIP 4 Receiver' 

/** CH Section ***/

/** Movers Section **/
update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select COUNT (distinct t1.WONumber) as JobsCount 
from @t t1 left join @t t2 on t1.WONumber = t2.WONumber and t2.ProductName like '%joey%'
where t1.ProductName like '%hopper%' and t1.WorkOrderType = 'CH' and t1.ServiceCodes like '%73%' and t1.Quantity = 1
and t2.WONumber is null
) as d
where r.Configuration = 'MV - Hopper' 

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select COUNT (distinct t1.WONumber) as JobsCount 
from @t t1 inner join @t t2 on t1.WONumber = t2.WONumber and t2.ProductId = '187894'
left join @t t3 on t1.WONumber = t3.WONumber and t3.ProductId  in ('199924' , '200438' , '203904' )
where t1.ProductName like '%hopper%' and t1.WorkOrderType = 'CH' and t1.ServiceCodes like '%73%' and t1.Quantity = 1
and t2.Quantity = 1 and t3.WONumber is null
) as d
where r.Configuration = 'MV - Hopper with Joey'

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select COUNT (distinct t1.WONumber) as JobsCount 
from @t t1 inner join @t t2 on t1.WONumber = t2.WONumber and t2.ProductId = '199924'
left join @t t3 on t1.WONumber = t3.WONumber and t3.ProductId in ('187894' , '200438' , '203904' )
where t1.ProductName like '%hopper%' and t1.WorkOrderType = 'CH' and t1.ServiceCodes like '%73%' and t1.Quantity = 1
and t2.Quantity = 1 and t3.WONumber is null
) as d
where r.Configuration = 'MV - Hopper with Wireless'

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select COUNT (distinct t1.WONumber) as JobsCount 
from @t t1 inner join @t t2 on t1.WONumber = t2.WONumber and t2.ProductId in ('203904' , '200438')
left join @t t3 on t1.WONumber = t3.WONumber and t3.ProductId in ('187894' , '199924' )
where t1.ProductName like '%hopper%' and t1.WorkOrderType = 'CH' and t1.ServiceCodes like '%73%' and t1.Quantity = 1
and t2.Quantity = 1 and t3.WONumber is null
) as d
where r.Configuration = 'MV - Hopper with Super'

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
(select count(vips.WONumber) as JobsCount from 
(
select 
WONumber , SUM(Quantity) VipCount
from
@t where IsVIP = 1 and WorkOrderType = 'CH' and ServiceCodes like '%73%' group by WONumber ) as vips 
where VipCount = 1) as d
where r.Configuration = 'MV - VIP 1 Receiver' 

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
(select count(vips.WONumber) as JobsCount from 
(
select 
WONumber , SUM(Quantity) VipCount
from
@t where IsVIP = 1 and WorkOrderType = 'CH' and ServiceCodes like '%73%' group by WONumber ) as vips 
where VipCount = 2) as d
where r.Configuration = 'MV - VIP 2 Receiver' 

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
(select count(vips.WONumber) as JobsCount from 
(
select 
WONumber , SUM(Quantity) VipCount
from
@t where IsVIP = 1 and WorkOrderType = 'CH' and ServiceCodes like '%73%' group by WONumber ) as vips 
where VipCount = 3) as d
where r.Configuration = 'MV - VIP 3 Receiver' 

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
(select count(vips.WONumber) as JobsCount from 
(
select 
WONumber , SUM(Quantity) VipCount
from
@t where IsVIP = 1 and WorkOrderType = 'CH' and ServiceCodes like '%73%' group by WONumber ) as vips 
where VipCount = 4) as d
where r.Configuration = 'MV - VIP 4 Receiver' 
/** Movers Section **/

/*** Additional Stuff ***/

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select
SUM(t.Quantity) - COUNT(t.WONumber) as JobsCount
from @t t
where t.ProductName like '%hopper%' and t.Quantity > 1
) as d
where r.Configuration = 'Additional Hopper'


update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select
SUM(t.Quantity) - COUNT(t.WONumber) as JobsCount
from @t t
where t.ProductId = '187894' and t.Quantity > 1
) as d
where r.Configuration = 'Additional Joey'

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select
SUM(t.Quantity) - COUNT(t.WONumber) as JobsCount
from @t t
where t.ProductId = '199924' and t.Quantity > 1
) as d
where r.Configuration = 'Additional Wireless Joey'

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
 (select
SUM(t.Quantity) - COUNT(t.WONumber) as JobsCount
from @t t
where t.ProductId in ('203904' , '200438') and t.Quantity > 1
) as d
where r.Configuration = 'Additional Super Joey'

update r
set 
r.NumberOfJobs = d.JobsCount
from @r as r ,
(select isnull(SUM(vipcount), 0 ) - (COUNT(WONumber) * 4) as JobsCount from 
(
select 
WONumber , isnull(SUM(Quantity), 0) VipCount
from
@t where IsVIP = 1 group by WONumber ) as vips 
where VipCount > 4) as d
where r.Configuration = 'Add. Receiver (current CH only)' 



/*** Additional Stuff ***/


select * from @r


