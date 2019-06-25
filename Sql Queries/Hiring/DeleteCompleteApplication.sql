create procedure dbo.[usp_delYearOldJobApplications]
as
begin
declare @ApplicationsToDelete table
( ApplicationId varchar(50))
insert into @ApplicationsToDelete
select Application_Id from tbl_HS_JobApplication 
where datediff(day,  Convert(date,CreatedDate,101) , convert(date,getdate(),101) ) >= 365
declare @vchar_Application_Id varchar(20)
while(exists(select * from @ApplicationsToDelete))
begin
set @vchar_Application_Id = (select top 1 ApplicationId from @ApplicationsToDelete)
begin transaction DeleteApplication
delete tbl_HS_CandidateEducationHistory where Application_Id = @vchar_Application_Id
 
delete tbl_HS_CandidateEmploymentHistory where Application_Id = @vchar_Application_Id
 
delete tbl_HS_DaysHoursForPartTimeCandidates where Application_Id = @vchar_Application_Id
 delete tbl_HS_InterviewSchedule where Application_Id = @vchar_Application_Id
delete tbl_HS_DrugTest where Application_Id = @vchar_Application_Id
 
delete tbl_HS_DrivingValidityCheck where Application_Id = @vchar_Application_Id
 
delete tbl_HS_JobApplication where Application_Id = @vchar_Application_Id

delete from @ApplicationsToDelete where ApplicationId = @vchar_Application_Id
commit transaction DeleteApllication

end

end