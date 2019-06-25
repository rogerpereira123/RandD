select distinct dp.WONumber from tbl_DishPayment dp 
inner join tbl_Data_Job_Setup tjs on dp.WONumber = tjs.WONumber where 
TaskDescription like '%Connectivity%' and TaskType = 'E'
and
tjs.CSGLastChangedDate >='11/01/2010'
and
tjs.CSGLastChangedDate <='01/04/2011'
and tjs.WorkorderType not in ('NC' , 'RC' , 'RS')
and
TaskDescription not in ('Connectivity Phone Line' , 'Connectivity DishCOMM' , 'Connectivity Phonex' , 'Connectivity Reimbursement')
 
and dp.PaymentAmount > 0
