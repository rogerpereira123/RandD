select ttp.TechCode , tts.TechName , tts.Supervisor from tbl_TechToPayrollClass ttp inner join tbl_TechToSupervisor tts 
on ttp.TechCode = tts.TechCode
where ttp.TechCode not in (
select TechCode from tbl_InvoiceMaster where WeekBeginningDate = '02/13/2008' and WeekEndingDate = '02/19/2008') and 
ttp.StartDate = '02/06/2008' and
ttp.endDate = '02/19/2008'
and
tts.TechCode not in (select distinct supervisor from tbl_techtosupervisor)
order by tts.Supervisor


select * from tbl_InvoiceMaster where TechCode = '1927'