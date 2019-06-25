

select  
from 
tbl_data_job_setup tc
inner join tbl_data_job_setup pr on   tc.CustomerId = pr.CustomerId 
where 
tc.saledate = '02/04/2008'
and
(tc.WorkorderType = 'TC' or tc.WorkorderType = 'SC')
and
zip.Supervisor = '1314'
and 
tc.CustomerZip = zip.ZipCode
and
pr.CSGStatus = 'C'
and
tc.workorderstatus <> 'Canceled'
/*and
(pr.WorkorderType = 'TC' or pr.WorkorderType = 'SC')*/
and
tc.wonumber <> pr.wonumber
and
datediff(Day,pr.CSGLastChangedDate, tc.saledate) <= 12
and 
datediff(Day,pr.CSGLastChangedDate, tc.saledate) >= 0


union

select cust1.customerid as 'TC Customer',cust2.customerid as 'Previous WO Customer',tc.CreatedDt as 'TC12 Created Date',tc.WONumber as 'TC12 WO', pr.WONumber as 'Previous WO',pr.csglastchangeddate as 'CSG completed date for previous WO' ,datediff(Day,pr.CSGLastChangedDate, tc.CreatedDt) as 'Date_Differnce'  
from internalworkorder tc, tbl_data_job_setup pr ,  tbl_ZipToSupervisor zip, tbl_data_customers cust1,tbl_data_customers cust2
where 
tc.CreatedDt = '02/04/2008'
and
(tc.WorkorderType = 'IC')
and
zip.Supervisor = '1314'
and 
cust1.ZipCode = zip.ZipCode
and
pr.CSGStatus = 'C'
and
tc.status in ('A' , 'C') 
/*and
(pr.WorkorderType = 'TC' or pr.WorkorderType = 'SC')*/
and
tc.wonumber <> pr.wonumber
and
/*tc.Customerid = pr.customerid*/
tc.Customerid = cust1.customerid
and
pr.customerid = cust2.customerid
and
cust1.accountno = cust2.accountno
and
datediff(Day,pr.CSGLastChangedDate, tc.CreatedDt) <= 12
and 
datediff(Day,pr.CSGLastChangedDate, tc.CreatedDt) >= 0

