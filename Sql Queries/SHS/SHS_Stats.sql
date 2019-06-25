select 
dp.TaskDescription as SHSType,
sum(
dp.PaymentAmount 
) as LaborPayment,
COUNT(distinct dp.WONumber) as NumberOfJobs
 from tbl_DishPayment dp 
inner join SHS s on dp.TaskDescription = s.Description
left join (
select distinct WONumber from tbl_DishPayment dishInner
inner join SHS sInner on dishInner.TaskDescription = sInner.Description 
where dishInner.ClosedDate between '07/01/2013' and '07/31/2013' and dishInner.TaskType = 'L'
group by dishInner.WONumber ,dishInner.TaskDescription  having sum(dishInner.PaymentAmount) = 0
) as chargebacks on dp.WONumber = chargebacks.WONumber
where dp.ClosedDate between '07/01/2013' and '07/31/2013' and dp.TaskType = 'L' 
and chargebacks.WONumber is null
group by dp.TaskDescription
order by TaskDescription asc


select 
dp.TaskDescription as SHSType,
sum(
dp.PaymentAmount
) as EquipmentPayment,
COUNT(distinct dp.WONumber) as NumberOfJobs
 from tbl_DishPayment dp 
inner join SHSEquipment s on dp.TaskDescription = s.Description
left join (
select distinct WONumber from tbl_DishPayment dishInner
inner join SHSEquipment sInner on dishInner.TaskDescription = sInner.Description 
where dishInner.ClosedDate between '07/01/2013' and '07/31/2013' and dishInner.TaskType = 'E'
group by dishInner.WONumber ,dishInner.TaskDescription  having sum(dishInner.PaymentAmount) = 0
) as chargebacks on dp.WONumber = chargebacks.WONumber
where dp.ClosedDate between '07/01/2013' and '07/31/2013' and dp.TaskType = 'E' 
group by dp.TaskDescription
order by TaskDescription asc


select 
dp.TaskDescription as SHSType,
sum(p.CostPrice) as PurchasginCost
 

 from tbl_DishPayment dp 
inner join SHSEquipment s on dp.TaskDescription = s.Description
left join (
select distinct WONumber from tbl_DishPayment dishInner
inner join SHSEquipment sInner on dishInner.TaskDescription = sInner.Description 
where dishInner.ClosedDate between '07/01/2013' and '07/31/2013' and dishInner.TaskType = 'E'
group by dishInner.WONumber ,dishInner.TaskDescription  having sum(dishInner.PaymentAmount) = 0
) as chargebacks on dp.WONumber = chargebacks.WONumber
inner join tbl_Product p on s.[TaskNo/StockNo] = p.ProductId
where dp.ClosedDate between '07/01/2013' and '07/31/2013' and dp.TaskType = 'E' 
group by dp.TaskDescription
--order by TaskDescription asc