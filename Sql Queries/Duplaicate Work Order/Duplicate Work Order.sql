delete from tbl_Data_Job_Setup where WONumber in (
select 
tjs.WONumber from 
tbl_Data_Job_Setup tjs 
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
where
tjs.WONumber like 'd%'
 and tdc.ACCOUNTNO like '9999%'
)

