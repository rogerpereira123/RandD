set ANSI_NULLS ON
set QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		Roger Pereira
-- =============================================
ALTER PROCEDURE [dbo].[TransferToBadaddresses]
 @wonumber as varchar(20),
 @complexName as nvarchar(120), 
 @permission as nvarchar(1),
 @polemount as nvarchar(5),
 @ddmdu as nvarchar(2),
 @restrictions as nvarchar(255)
AS


BEGIN
declare @phone nvarchar(15)
declare @address nvarchar(128)
declare @city nvarchar(50)
declare @zipcode nvarchar(10)
declare @name nvarchar(120)

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



