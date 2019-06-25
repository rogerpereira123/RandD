--update receivers
update
tbl_RAED
set 
[Status] = tbl_RA.[Status],
[DishRANumber] = tbl_RA.[Dish RA Number],
[RMAReceivedDate] = tbl_RA.[RMAReceivedDate] ,
[FedexId] = tbl_RA.[FedexId] ,
[ReadyToShipDate] = tbl_RA.[ReadyToShipDate],
[LastSubmitted] =tbl_RA.LastSubmitted 
from tbl_RA
where
tbl_RAED.SerialNumber = tbl_RA.[Dish Serial #]
and
tbl_RAED.SerialNumber is not null
and
tbl_raed.SerialNumber <> ''
/*and
tbl_ra.RMAReceivedDate >= '01/19/2010'*/
and
(tbl_raed.DishRANumber is null or tbl_raed.DishRANumber = '')
and
tbl_ra.[Dish RA Number] is not null
and
tbl_ra.[Dish Ra Number] <> ''

--update non-receivers
/*update
tbl_RAED
set 
[Status] = tbl_RA.[Status],
[DishRANumber] = tbl_RA.[Dish RA Number],
[RMAReceivedDate] = tbl_RA.[RMAReceivedDate] ,
[FedexId] = tbl_RA.[FedexId] ,
[ReadyToShipDate] = tbl_RA.[ReadyToShipDate],
[LastSumitted] =tbl_RA.LastSubmitted 
from tbl_RA
where
tbl_RAED.SerialNumber is null
and
tbl_RAED.WorkOrderNumber = tbl_RA.[Dish WO Number] 
and
tbl_RAED.Name = convert(varchar(1000) , tbl_RA.Desc1)
*/



select newra.WorkOrderNumber , newra.SrNo as 'NewSrNo',oldra.SrNo as 'OldSrNo'
into #temp
from 
tbl_RAED newra
inner join tbl_RA oldra on newra.WorkOrderNumber = oldra.[Dish WO Number]
where
(newra.SerialNumber is null
or
newra.SerialNumber = ''
)
and
newra.Name = convert(varchar(1000) , oldra.Desc1)
/*and
oldra.RMAReceivedDate >= '01/19/2010'*/
and
(newra.DishRANumber is null or newra.DishRANumber = '')
and
oldra.[Dish RA Number] is not null
and
oldra.[Dish Ra Number] <> ''
order by WorkOrderNumber,newra.SrNo , oldra.SrNo

declare @NewSrNo int
declare @OldSrNo bigint
declare @WO varchar(20)
while(exists(select * from #temp))
begin
	set @NewSrNo = (select top 1 NewSrNo from #temp)
	set @OldSrNo = (select top 1 OldSrNo from #temp)
	set @WO = (select top 1 WorkOrderNumber from #temp)
	
	update
	tbl_RAED
	set 
	[Status] = tbl_RA.[Status],
	[DishRANumber] = tbl_RA.[Dish RA Number],
	[RMAReceivedDate] = tbl_RA.[RMAReceivedDate] ,
	[FedexId] = tbl_RA.[FedexId] ,
	[ReadyToShipDate] = tbl_RA.[ReadyToShipDate],
	[LastSubmitted] =tbl_RA.LastSubmitted 
	from tbl_RA
	where
	(tbl_RAED.SerialNumber is null or tbl_raed.SerialNumber = '') 
	and
	tbl_RA.SrNo = @OldSrNo
	and
	tbl_RAED.SrNo = @NewSrNo
	and
	tbl_RAED.WorkOrderNumber = @WO
	and
	(tbl_RAED.DishRANumber is null or tbl_RAED.DishRANumber = '')
	
	


	
	
	delete from #temp where WorkOrderNumber = @WO and NewSrNo = @NewSrNo
	delete from #temp where OldSrNo = @OldSrNo 
	
end

drop table #temp