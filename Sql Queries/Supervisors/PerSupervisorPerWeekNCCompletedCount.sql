declare @data table
(
Supervisor varchar(10),
WeekStartDate date,
WeekEndDate date,
WONumber varchar(20)

)
insert into @data
select
zts.Supervisor , him.WeekBeginningDate , him.WeekEndingDate ,tjs.wonumber 
from 
tbl_HourlyInvoiceMaster him
inner join tbl_HourlyInvoiceLine hil on him.InvoiceId = hil.InvoiceId
inner join tbl_Data_Job_Setup tjs on hil.WONumber= tjs.WONumber
inner join tbl_ZIPtoSupervisor zts on tjs.CustomerZip = zts.ZipCode
where
him.WeekBeginningDate >= '03/30/2011'
and
tjs.WorkorderType in ('NC' , 'RC' , 'RS')

order by zts.supervisor , him.WeekBeginningDate

insert into @data
select
zts.Supervisor , him.WeekBeginningDate , him.WeekEndingDate ,tjs.wonumber
from 
tbl_InvoiceMaster him
inner join tbl_InvoiceLine hil on him.InvoiceId = hil.InvoiceId
inner join tbl_Data_Job_Setup tjs on hil.WONumber= tjs.WONumber
inner join tbl_ZIPtoSupervisor zts on tjs.CustomerZip = zts.ZipCode
where
him.WeekBeginningDate >= '03/30/2011'
and
tjs.WorkorderType in ('NC' , 'RC' , 'RS')
order by zts.supervisor , him.WeekBeginningDate

insert into @data
select
distinct zts.Supervisor , d1.WeekStartDate , d1.WeekEndDate ,tjs.wonumber
from
tbl_Data_Job_Setup tjs
inner join tbl_ZIPtoSupervisor zts on tjs.CustomerZip = zts.ZipCode
left join @data d on tjs.WONumber = d.WONumber
inner join (select distinct Supervisor , WeekStartDate , WeekEndDate from @data) d1 on d1.Supervisor = zts.Supervisor
where
d.WONumber is null
and
tjs.CSGLastChangedDate between d1.WeekStartDate and d1.WeekEndDate
and
tjs.CSGStatus = 'C'
and
tjs.WorkorderType in ('NC' , 'RC' , 'RS')




select Supervisor , WeekStartDate , WeekEndDate ,COUNT(WONumber) as CompletedCount from @data 
group by Supervisor , WeekStartDate , WeekEndDate
