set ANSI_NULLS ON
set QUOTED_IDENTIFIER ON
GO


ALTER function [dbo].[usp_getLastTechVisit_Internal](@int_customerID int, @vchar_SaleDate datetime, @vchar_WONumber varchar(19))
returns int
as
begin
declare
 @LastCompletedDate datetime ,
 @DateDifference int,
 @IsWithIn12Days int
set  @IsWithIn12Days =0

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
			set @IsWithIn12Days=1
		end
end 
else
	
begin
	set  @IsWithIn12Days =0
end
return @IsWithIn12Days

end



