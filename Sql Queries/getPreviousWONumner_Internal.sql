set ANSI_NULLS ON
set QUOTED_IDENTIFIER ON
GO


ALTER function [dbo].[usp_getPreviousWONumber_Internal](@int_customerID int, @vchar_SaleDate datetime, @vchar_WONumber varchar(19))  
returns varchar(19)  
as  
begin  
declare  
 @PreviousWONumber varchar(19),  
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
   set @PreviousWONumber=(select top 1 WONumber from tbl_data_job_setup  
   where CustomerID=@int_customerID  
   and CSGLastChangedDate=@LastCompletedDate   
   )  
  end  
 else  
  begin  
   set @PreviousWONumber=@vchar_WONumber  
  end  
end   
  
else  
begin  
 set  @PreviousWONumber =@vchar_WONumber  
end  
  
return @PreviousWONumber  
  
end  
  
  
  







