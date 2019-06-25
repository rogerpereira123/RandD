select sum(PaymentAmount) from tbl_dishPayment
where
convert(datetime , convert(varchar(10), ClosedDate , 101) ,101) >= '03/01/2009'
and
convert(datetime , convert(varchar(10), ClosedDate , 101) ,101) <= '03/31/2009'
and
TaskType = 'L'



select distinct dish.wonumber ,dish.paymentamount,tjs.TechCode , tdc.Phone , tc.DIshPayCode  from 
tbl_data_job_setup tjs
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
inner join tbl_TCSCPayment tc on tjs.WoNumber = tc.WoNumber
inner join tbl_DishPayment dish on tc.WONumber = dish.WoNumber
where
tjs.CSgLastChangedDate >= '03/01/2009'
and
tjs.CSGLastChangedDate <= '03/31/2009'
and
tc.DIshPayCode = 'NONBIL'
and
dish.TaskType = 'L'
and
convert(datetime , convert(varchar(10), ClosedDate , 101) ,101) >= '03/01/2009'
and
convert(datetime , convert(varchar(10), ClosedDate , 101) ,101) <= '03/31/2009'
and
dish.wonumber not in (select wonumber from tbl_dishpayment where wonumber = dish.wonumber and paymentamount = dish.paymentamount * -1)



select sum(RequestedAmount)
from 
tbl_ReconMaster recon 
inner join tbl_data_job_setup tjs on recon.Wonumber = tjs.WoNumber
left join tbl_TCSCPayment tc on tjs.WoNumber = tc.WoNumber
where
tjs.CSgLastChangedDate >= '03/01/2009'
and
tjs.CSGLastChangedDate <= '03/31/2009'
and
isnull(tc.DishPayCode , '') <> 'NONBIL'
and
recon.RecordTypeId = 'L'
