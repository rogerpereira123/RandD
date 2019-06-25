--select * from tbl_Data_Customers where ACCOUNTNO like '9999%'
select * from tbl_Data_Customers where WoReference = '80126752700001001'
select * from tbl_Data_Job_Setup where WONumber = '80126752700001001'
select * from tbl_EConnectServiceAutodownload where WORK_ORDER_NUMBER = '80126752700001001'

--delete from tbl_Data_Customers where CUSTOMERID = 926753
--update tbl_Data_Job_Setup set CustomerID = 926752 where WONumber = '80126752700001001'