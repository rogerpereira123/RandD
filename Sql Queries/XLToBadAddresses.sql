

-- =============================================
-- Author:		Roger Pereira
-- =============================================
CREATE PROCEDURE [dbo].[TransferToBadaddresses]
 @wonumber as varchar,
 @complexName as varchar, 
 @permission as varchar,
 @polemount as varchar,
 @ddmdu as varchar,
 @restrictions as varchar
AS


BEGIN
declare @phone varchar
declare @address varchar
declare @city varchar
declare @zipcode varchar
declare @name varchar

select @phone = cust.phone , @address=cust.address ,  @city=cust.city ,  @zipcode=cust.zipcode ,
 @name =cust.name 
from tbl_data_customers cust, tbl_data_job_setup job
where
job.wonumber  = @wonumber 
and
job.customerid = cust.customerid

insert into bad_addresses([Complex Name],  [phone number], [street address], city,[zip code],[contact name],
permission,[pole mount],[dd mdu],restrictions)
values
(@complexname, @phone,@address,@city,@zipcode,@name,@permission,@polemount,@ddmdu,@restrictions)

	

    
END
GO
