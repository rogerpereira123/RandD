
select * from tbl_data_job_setup 
where 
--For WildBlue Identification
(servicecodes like '%I1%' or servicecodes like '%I3%' or servicecodes like '%~9%' or servicecodes like '%I6%' or servicecodes like '%I2%')
and
--For New Installations
(servicecodes like '%KQ%' or servicecodes like '%-K%')
and 
workordertype = 'CH'
and
saledate = '05/04/2007'


select * from tbl_data_customers where customerid = '499906'

