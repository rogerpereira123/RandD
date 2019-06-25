select * from tbl_data_job_setup tjs
left join tbl_TCSCPayment tc on tjs.WoNumber = tc.WoNumber where 
tjs.CSgLastChangedDate >= '03/01/2009'
and
tjs.CSgLastChangedDate <= '03/31/2009'
and
tjs.CSgStatus in ('C'  , 'D')
and
tjs.WorkOrderType in ('NC' , 'RC' , 'RS')
and
tjs.wonumber not in (select wonumber from tbl_dishpayment /*where convert(datetime , convert(varchar(10) , closeddate , 101) , 101) >= '03/01/2009' and
convert(datetime , convert(varchar(10) , closeddate , 101) , 101) <= '03/31/2009'*/)
and
isnull(tc.DishPayCode , '') <>'NONBIL'
and
tjs.TechCode not like '8%'
and
tjs.TechCode not like 'Ret%'
and
tjs.WoNumber in (select WoNumber from tbl_ExpectedWoLaborPayment where ReimAmount <> 0)


