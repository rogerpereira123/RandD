USE [Northware]
GO
/****** Object:  StoredProcedure [dbo].[sp_InsertUpdate_CustomerImported_new_WebService]    Script Date: 12/28/2012 12:06:58 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO









ALTER PROCEDURE [dbo].[sp_InsertUpdate_CustomerImported_new_WebService] AS

 --REmoved Distinct for Masking CHanges from EConnect
 --04/19/2012 Making changes to accept all the work orders including the ones which are cancelled before downloading. After email from Dawn, Victor
 declare @UpdatedDateColumnExists bit = 1
if not Exists(select * from sys.columns where Name = 'UPDATED_DATE' and Object_ID = Object_ID('tbl_EConnectServiceAutodownload'))
begin
	set @UpdatedDateColumnExists = 0
end
	

 select CSG_ACCT_NUMBER as accountno,CUSTOMER_NAME,CUSTOMER_ADDRESS,CUSTOMER_CITY,CUSTOMER_ZIP,CUSTOMER_PHONE,SECONDARY_PH,Work_Order_Number ,case when @UpdatedDateColumnExists = 1 then UPDATED_DATE else GETDATE() end as Updated_date  into #temp1 from tbl_EConnectServiceAutodownload where customerid is null 


 
 
 declare @DuplicateAccounts table (AccountNumber varchar(20) , CustomerName varchar(500) , CustomerAddress varchar(500) , City varchar(500) , Zip varchar(500) , Phone1 varchar(500) , Phone2 varchar(500) , WONumber varchar(20) , Updated_date datetime)
 
 insert into @DuplicateAccounts 
 select * from #temp1 where accountno in (select accountno from #temp1 group by accountno having COUNT(accountno) > 1 and accountno not like '9999%') order by accountno , updated_date desc
 
 delete t 
 from #temp1 as t 
 inner join (select work_order_Number , Max(updated_date) as MaxUpdatedDate from #temp1 group by work_order_number having count(work_order_number) > 1 ) as duplicates on t.work_order_number = duplicates.work_order_number
 where t.updated_date <> duplicates.MaxUpdatedDate
 
 
 
 insert into tbl_data_customers (accountno , name,address,city , zipcode,phone,phone2, WOReference) 
 select 
 distinct t.accountno,CUSTOMER_NAME,CUSTOMER_ADDRESS,CUSTOMER_CITY,CUSTOMER_ZIP,
 replace( replace(replace(replace(CUSTOMER_PHONE,'(',''),')',''),' ',''),'-',''),
 replace( replace(replace(replace(substring(ltrim(rtrim(SECONDARY_PH)),0,30),'(',''),')',''),' ',''),'-',''), Work_Order_Number from #temp1 t left join @DuplicateAccounts on t.accountno = AccountNumber where AccountNumber is null
 
 declare @acct varchar(20)
 while(exists(select * from @DuplicateAccounts))
 begin
	set @acct = (select top 1 accountnumber from @DuplicateAccounts)
	insert into tbl_data_customers (accountno , name,address,city , zipcode,phone,phone2 , WOReference) 
	select top 1 AccountNumber, CustomerName , CustomerAddress , City , Zip , Phone1 , Phone2, WONumber from @DuplicateAccounts where AccountNumber = @acct
	delete from @DuplicateAccounts where AccountNumber = @acct
 end
 
 

/****This change is done to avoid the duplicate customers being inserted when two new jobs come for a new customers for the first time *****/


UPDATE    tbl_EConnectServiceAutodownload
SET            customerid
=  tbl_data_Customers.customerID
FROM        
tbl_data_Customers
WHERE    tbl_EConnectServiceAutodownload.CSG_ACCT_NUMBER
=  tbl_data_Customers.accountno
and
tbl_EConnectServiceAutodownload.CSG_ACCT_NUMBER not like '99999%'
and
tbl_Data_Customers.ACCOUNTNO not like '99999%'
and tbl_EConnectServiceAutodownload.CustomerId is null




UPDATE    tbl_EConnectServiceAutodownload
SET            customerid
=  tbl_data_customers.customerID
FROM         tbl_EConnectServiceAutodownload, 
tbl_data_customers
WHERE  tbl_EConnectServiceAutodownload.WORK_ORDER_NUMBER = tbl_data_customers.WOReference
and tbl_Data_Customers.ACCOUNTNO like '99999%' and tbl_EConnectServiceAutodownload.CustomerId is null


/***********************/

drop table #temp1


--Changed the join fields to customerid instead of account number for masking changes
update tbl_data_customers set   name =  CUSTOMER_NAME, address = CUSTOMER_ADDRESS, city = CUSTOMER_CITY,
zipcode=CUSTOMER_ZIP,
 phone
=replace( replace(replace(replace(tbl_EConnectServiceAutodownload.CUSTOMER_PHONE,'(',''),')',''),' ',''),'-',''), 
phone2=replace( replace(replace(replace(tbl_EConnectServiceAutodownload.SECONDARY_PH,'(',''),')',''),' ',''),'-','')

from tbl_EConnectServiceAutodownload , tbl_data_customers 
where tbl_EConnectServiceAutodownload.CSG_ACCT_NUMBER = tbl_data_customers.ACCOUNTNO 
and tbl_EConnectServiceAutodownload.CSG_ACCT_NUMBER not like '99999%' and tbl_Data_Customers.ACCOUNTNO not like '99999%' 



---TO handle the scenario of multiple masked job in Northware and multiple unmasked jobs downloaded in single download
declare @MultipleAccontsInOneDownload table (CustId bigint)

insert into @MultipleAccontsInOneDownload
select MAX(CustomerId) from tbl_EConnectServiceAutodownload where CustomerId is not null group by CSG_ACCT_NUMBER having COUNT(CSG_ACCT_NUMBER) > 1 and CSG_ACCT_NUMBER not like '9999%'



update tbl_data_customers set ACCOUNTNO = CSG_ACCT_NUMBER,  name =  CUSTOMER_NAME, address = CUSTOMER_ADDRESS, city = CUSTOMER_CITY,
zipcode=CUSTOMER_ZIP,
 phone
=replace( replace(replace(replace(tbl_EConnectServiceAutodownload.CUSTOMER_PHONE,'(',''),')',''),' ',''),'-',''), 
phone2=replace( replace(replace(replace(tbl_EConnectServiceAutodownload.SECONDARY_PH,'(',''),')',''),' ',''),'-','')

from tbl_EConnectServiceAutodownload , tbl_data_customers where tbl_EConnectServiceAutodownload.CustomerId = tbl_data_customers.CUSTOMERID and tbl_Data_Customers.ACCOUNTNO like '9999%' 
and tbl_EConnectServiceAutodownload.CustomerId not in (select ma.CustId from @MultipleAccontsInOneDownload ma)


update tjs
set tjs.CustomerId = tdc.CUSTOMERID
from tbl_EConnectServiceAutodownload as download 
inner join @MultipleAccontsInOneDownload ma on download.CustomerId = ma.CustId
inner join tbl_Data_Customers tdc on download.CSG_ACCT_NUMBER = tdc.ACCOUNTNO
inner join tbl_Data_Job_Setup tjs on download.WORK_ORDER_NUMBER = tjs.WONumber
where
tdc.ACCOUNTNO not like '9999%'
and download.CSG_ACCT_NUMBER not like '9999%'

update download
set download.CustomerId = tdc.CUSTOMERID
from tbl_EConnectServiceAutodownload as download 
inner join @MultipleAccontsInOneDownload ma on download.CustomerId = ma.CustId
inner join tbl_Data_Customers tdc on download.CSG_ACCT_NUMBER = tdc.ACCOUNTNO
inner join tbl_Data_Job_Setup tjs on download.WORK_ORDER_NUMBER = tjs.WONumber
where
tdc.ACCOUNTNO not like '9999%'
and download.CSG_ACCT_NUMBER not like '9999%'





--Update County for all the curstomers downloaded so as to track the address changes. Changed 01/06/2010
UPDATE  [tbl_data_customers]
SET [tbl_data_customers].County = [tbl_zipMAbranch].County,
[tbl_data_customers].STATE = [tbl_zipMAbranch].ST
FROM 
[tbl_zipMAbranch] INNER JOIN [tbl_data_customers] ON [tbl_data_customers].zipcode =
[tbl_zipMAbranch].zipcode 
inner join tbl_EConnectServiceAutodownload on tbl_EConnectServiceAutodownload.CustomerId = tbl_data_customers.CUSTOMERID





/*UPDATE    tbl_data_customers 
SET   phone
=replace( replace(replace(replace(phone,'(',''),')',''),' ',''),'-',''), 
phone2
=replace( replace(replace(replace(phone2,'(',''),')',''),' ',''),'-','')
where
phone like '%(%'
or
phone2 like '%(%'*/






