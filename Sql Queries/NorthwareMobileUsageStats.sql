select
tjs.WONumber, tjs.WorkorderType , tjs.CSGStatus, tdc.NAME as Customer , tjs.TechCode , case when iwo.WONumber IS null then 'No' else 'Yes' end as IsClosedInNorthware 
from tbl_Data_Job_Setup tjs
inner join tbl_InvParticipant2User ip2u on tjs.TechCode = ip2u.UserId
inner join tbl_Warehouse w on ip2u.InvParticipantId = w.InvParticipantId
left join tbl_Mobility_InternalWorkOrderClosing iwo on iwo.WONumber = tjs.WONumber
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
where
w.WarehouseName = 'Canton'
and tjs.ScheduledDate = '10/03/2012' and tjs.CSGStatus = 'C'  and dbo.udf_IsContractor(tjs.TechCode , 0) = ''
order by tjs.TechCode