select tdc.*
from tbl_Data_Job_Setup tjs
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
where
tjs.ScheduledDate = '05/03/2010'
and
tdc.ACCOUNTNO like '9999%'


select ACCOUNTNO , COUNT(ACCOUNTNO)
 from tbl_Data_Customers group by ACCOUNTNO having COUNT(accountno) > 1 and ACCOUNTNO not  like '9999%'