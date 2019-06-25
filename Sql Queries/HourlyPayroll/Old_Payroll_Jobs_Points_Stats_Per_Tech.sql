select
tts.TechCode, tts.TechName,(count(tjs.WoNumber) + count(iwo.Wonumber)) as Jobs  , (sum(isnull(tjs.WorkUnits , 0)) + (count(iwo.WoNumber) * 12)) as Points
from 
tbl_InvoiceMaster IM
inner join tbl_TechToSupervisor tts on IM.TechCode = tts.TechCode
inner join tbl_InvoiceLine IL on IM.InvoiceID = IL.InvoiceId
left join tbl_data_job_setup tjs on IL.WoNumber = tjs.WoNumber
left join internalworkorder iwo on IL.WONumber = iwo.WoNumber
where
IM.WeekBeginningDate = '01/14/2009'
and
IM.WeekEndingDate = '01/20/2009'
and
IM.InvoiceClassId not in ('CD' , 'ME' , 'CT')
group by tts.TechCode, tts.TechName order by tts.TechName
