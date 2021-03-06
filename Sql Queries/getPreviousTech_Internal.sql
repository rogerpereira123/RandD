set ANSI_NULLS ON
set QUOTED_IDENTIFIER ON
GO


ALTER function [dbo].[usp_getPreviousTech_Internal](@int_customerID int, @vchar_SaleDate datetime, @vchar_WONumber varchar(19))
returns varchar(8)
as
begin
declare
 @PreviousTech varchar(8),
 @LastCompletedDate datetime,
 @DateDifference int

if exists(select max(CSGLastChangedDate) from tbl_data_job_setup
where CustomerID=@int_customerID)
begin
	set @LastCompletedDate=(select max(CSGLastChangedDate) from tbl_data_job_setup
	where CustomerID=@int_customerID)

	set @DateDifference=abs(DateDiff(day,  
	cast(Convert(varchar(12),@LastCompletedDate,101) as datetime),  
	cast(Convert(varchar(12),@vchar_SaleDate,101) as datetime))) 

	if @DateDifference <=12
		begin
			set @PreviousTech=(select top 1 TechCode from tbl_data_job_setup
			where CustomerID=@int_customerID
			and CSGLastChangedDate=@LastCompletedDate)
		end
end 

return @PreviousTech

end










