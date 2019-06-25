
select * from tbl_data_customers
where 
accountno = '8255909363872240' and 
customerid <> ( select top 1 cust.customerid from tbl_data_job_setup wo,tbl_data_customers cust where
			   wo.customerid = cust.customerid and cust.accountno = '8255909363872240'  order by wo.saledate desc)
			   		 

