declare @OldTech varchar(4)
declare @newTech varchar(4)
set @OldTech = '6284'
set @newTech ='6184'

declare @Update bit = 1

/*select * from tbl_Data_Employees where TechNumber = @OldTech
select * from tbl_TechToPayrollClass where TechCode = @OldTech
select * from tbl_TechtoSupervisor where TechCode = @OldTech
select * from tbl_TechToLocation where techcode = @OldTech
--select * from tbl_TechCheckInTimes where TechCode = @OldTech
select * from tbl_HourlyInvoiceMaster where TechCode = @OldTech
select * from tbl_Data_Job_Setup where TechCode= @OldTech and ScheduledDate >= '01/01/2012'
select * from InternalWorkOrder where TechCode = @OldTech and ScheduledDate >= '01/01/2012'
select * from tbl_daily_opportunities where TechCode = @OldTech and [Date] >= '01/01/2012'
select * from tbl_User where UserId = @OldTech
--select * from tbl_DailyMilageTracker where TechCode=  @OldTech

select * from tbl_Mobility_InternalWorkOrderClosing where TechCode = @OldTech
select * from tbl_WOTimes where UserId = @OldTech
select * from tbl_HourlyTechToPayrollParameterConfiguration where TechCode = @OldTech
select * from tbl_DishCustomerSurveyData where  TechCode = '01043'+@OldTech*/ 



if(@Update = 1)
begin
update tbl_Data_Employees set TechNumber = @newTech where TechNumber = @OldTech
update tbl_TechToPayrollClass set TechCode = @newTech where TechCode = @OldTech
update tbl_TechtoSupervisor set TechCode = @newTech where TechCode = @OldTech
update tbl_TechToLocation set TechCode = @newTech where TechCode = @OldTech
--update tbl_TechCheckInTimes set TechCode = @newTech where TechCode = @OldTech
update tbl_HourlyInvoiceMaster set TechCode = @newTech where TechCode = @OldTech
update tbl_Data_Job_Setup set TechCode = @newTech where TechCode = @OldTech and ScheduledDate >= '01/01/2013'
update InternalWorkOrder set TechCode = @newTech where TechCode = @OldTech and ScheduledDate >= '01/01/2013'
update tbl_User set UserId = @newTech where UserId = @OldTech
update tbl_InvParticipant2User set UserId =@newTech where UserId = @OldTech 
update tbl_daily_opportunities set TechCode = @newTech where TechCode = @OldTech and [Date] >= '01/01/2013'
update tbl_GrouptoUser set UserId = @newTech where UserId = @OldTech
update tbl_UserToScreen set UserId = @newTech where UserId = @OldTech
--update tbl_DailyMilageTracker set TechCode = @newTech where TechCode = @OldTech

update tbl_Mobility_InternalWorkOrderClosing set TechCode = @newTech where TechCode = @OldTech
update tbl_HourlyTechToPayrollParameterConfiguration set TechCode = @newTech where TechCode = @OldTech
update tbl_DishCustomerSurveyData set TechCode = '01043' + @newTech where TechCode = '01043'+@OldTech and CallDate > '01/01/2013'
update tbl_OutTechClockIn set TechCode = @newTech where TechCode = @OldTech
update tbl_OutTechClockOut set TechCode = @newTech where TechCode = @OldTech
update tbl_TechPayrollDetails set TechCode = @newTech where TechCode = @OldTech

update tbl_IVR_EquipmentDiscrepancy set TechCode = @newTech where TechCode = @OldTech

update tbl_TechDayEndProcess set TechCode = @newTech where TechCode = @OldTech

update tbl_TechDayEndProcessEventLog set TechCode = @newTech where TechCode = @OldTech

update tbl_User set ETADirectExternalId = 'RPT_01043-6184_Evan.McCune' where UserId = '6184'
 

end


