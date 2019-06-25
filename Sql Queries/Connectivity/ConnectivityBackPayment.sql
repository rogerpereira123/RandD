select 
Tech# , sum(case when (cbp.[Grand Total] - tpd.GrandTotal) < 0 then  0 else (cbp.[Grand Total] - tpd.GrandTotal) end) as Difference
into #ConnectivityBackPayTemp

from ConnectivityBackPayment cbp
inner join  tbl_TechPayrollDetails tpd on cbp.Tech# = tpd.TechCode and  cbp.PayrollStartDate = tpd.PayrollStartDate

group by Tech#
order by  Difference desc


select 
tde.TechNumber, tde.EmployeeNumber, tde.Lastname + ',' + tde.Firstname as EmployeeName , convert(money,ROUND(DIFFERENCE, 2)) as Amount , '35' as PayCode
from #ConnectivityBackPayTemp ctp
inner join tbl_Data_Employees tde on ctp.Tech# = tde.TechNumber
where
DIFFERENCE > 0
order by DIFFERENCE desc


select SUM(DIFFERENCE)
from #ConnectivityBackPayTemp

drop table #ConnectivityBackPayTemp