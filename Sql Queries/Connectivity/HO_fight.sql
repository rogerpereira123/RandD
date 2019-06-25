select
tdc.NAME as CustomerName,tdc.PHONE , iwo.WONumber,iwo.LastupdatedDt as ClosedDate,iwo.techcode,tts.TechName,two.Equipment as ConnectedWith,iwo.ServiceProblem,ttsSup.TechName as SupervisorName, ttsSup.TechCode as Supervisor
/*,qc.WONumber as QCJob,qc.InspectDate
,qc.Inspector*/

from
internalworkorder iwo
inner join tbl_WOConnectivity two on iwo.WONumber = two.WONumber
inner join tbl_Data_Customers tdc on iwo.CustomerID = tdc.CUSTOMERID
/*inner join tbl_Data_Job_Setup tjs on tdc.CUSTOMERID = tjs.CustomerID
inner join tbl_RevisedQC_QCMaster qc on tjs.WONumber = qc.WONumber*/
inner join tbl_TechtoSupervisor tts on iwo.TechCode = tts.TechCode
inner join tbl_TechtoSupervisor ttsSup on tts.Supervisor = ttsSup.TechCode
where
two.Equipment <> ''
and
iwo.LastupdatedDt >= '09/12/2010'
and
iwo.LastupdatedDt <= '10/12/2010'
and
iwo.Status in ('C')
and
iwo.WorkorderType = 'HO'
and
iwo.TechCode  in 
(select techcode from tbl_TechToPayrollClass where InvoiceClassId in ('CD' , 'CT', 'ME' , 'M2' , 'M3','M4'))
/*and
qc.InspectDate >= iwo.ScheduledDate
and
iwo.TechCode  in (select UserId from login where type in ('f','s'))*/
order by iwo.WONumber
