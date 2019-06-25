create procedure usp_MonitorEConnectService
as
begin
	declare @Receivers varchar(500) = 'victor@safe7.com;roger@safe7.com'
	declare @Subject varchar(500) = ''
	declare @Body varchar(2000) = ''


    --Check If file is uploaded after 10 every day
	if(not exists(select InsertDate from tbl_Mobility_EquipmentUtilized where CONVERT(date,Insertdate) = CONVERT(date, GETDATE()) group by InsertDate having COUNT(WONumber) > 100))
	begin
		
	end
	
	exec msdb.dbo.sp_send_dbmail @profile_name = 'DB_Mail',
    @recipients = @Receivers,
    @body = @Body,
    @subject = @Subject;
    
end