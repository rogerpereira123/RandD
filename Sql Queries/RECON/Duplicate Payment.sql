select dp.*
from tbl_DishPayment tdp
inner join DishPayment dp on tdp.WONumber = dp.[Referral ID]
where
tdp.PaymentAmount = dp.[Payment Amount]
and
tdp.TaskDescription = dp.[Task Description]