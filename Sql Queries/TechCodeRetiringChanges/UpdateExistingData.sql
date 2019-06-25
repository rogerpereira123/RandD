
update t
set
t.TechCode = e.ETALoginId
from
tbl_TechCodeToOldETADirectExternalIdToNewETADirectExternalId t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null	


---------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_TechDayEndProcessEventLog t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_TechToFSM t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

update t
set
t.FSM = e.ETALoginId
from
tbl_TechToFSM t 
inner join tbl_TechCodeToETALoginId e on t.FSM = e.TechCode
where t.FSM is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_TS_TechStatusNotes t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null


----------------------------

update t
set
t.Supervisor = e.ETALoginId
from
tbl_ZIPtoSupervisor t 
inner join tbl_TechCodeToETALoginId e on t.Supervisor = e.TechCode
where t.Supervisor is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_Payroll_ReimbursementInvoiceMaster t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_TechCheckInTimes t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_TechDayEndProcess t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_ContractorPayrollDetails t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_daily_opportunities t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_DailyMilageTracker t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.RevieweeUserId = e.ETALoginId
from
tbl_ReviewSystem_ReviewMaster t 
inner join tbl_TechCodeToETALoginId e on t.RevieweeUserId = e.TechCode
where t.RevieweeUserId is not null

update t
set
t.ReviewerUserId = e.ETALoginId
from
tbl_ReviewSystem_ReviewMaster t 
inner join tbl_TechCodeToETALoginId e on t.ReviewerUserId = e.TechCode
where t.ReviewerUserId is not null



----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_DishConnectivity t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

update t
set
t.TechCode = e.ETALoginId
from
tbl_DishConnectivity t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = '01043'+e.TechCode
where t.TechCode is not null

update t
set
t.TechCode = e.ETALoginId
from
tbl_DishConnectivity t 
inner join tbl_TechCodeToETALoginId e on t.Installer = '01043'+e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_IVR_EquipmentDiscrepancy t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_InvoiceMaster t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
InternalWorkOrder t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

update t
set
t.OriginalInstaller = e.ETALoginId
from
InternalWorkOrder t 
inner join tbl_TechCodeToETALoginId e on t.OriginalInstaller = e.TechCode
where t.OriginalInstaller is not null


update t
set
t.LastInstaller = e.ETALoginId
from
InternalWorkOrder t 
inner join tbl_TechCodeToETALoginId e on t.LastInstaller = e.TechCode
where t.LastInstaller is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_TechToPayrollClass t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_DishPayment t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

update t
set
t.TechCode = e.ETALoginId
from
tbl_DishPayment t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = '01043' + e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_InvoicePaperwork t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_HourlyTechToPayrollParameterConfiguration t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_TS_TechETA t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_TechtoSupervisor t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null


update t
set
t.Supervisor = e.ETALoginId
from
tbl_TechtoSupervisor t 
inner join tbl_TechCodeToETALoginId e on t.Supervisor = e.TechCode
where t.Supervisor is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_TechPayrollDetails t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_Mobility_InternalWorkOrderClosing t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_DishCustomerSurveyData t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

update t
set
t.TechCode = e.ETALoginId
from
tbl_DishCustomerSurveyData t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = '01043'+ e.TechCode
where t.TechCode is not null

----------------------------


update t
set
t.TechCode = e.ETALoginId
from
tbl_OutTechClockOut t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------


update t
set
t.Inspector = e.ETALoginId
from
tbl_QCSchedule t 
inner join tbl_TechCodeToETALoginId e on t.Inspector = e.TechCode
where t.Inspector is not null

update t
set
t.AssignedBy = e.ETALoginId
from
tbl_QCSchedule t 
inner join tbl_TechCodeToETALoginId e on t.AssignedBy = e.TechCode
where t.AssignedBy is not null

----------------------------

update t
set
t.Inspector = e.ETALoginId
from
tbl_RevisedQC_QCMaster t 
inner join tbl_TechCodeToETALoginId e on t.Inspector = e.TechCode
where t.Inspector is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_OutTechClockIn t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_Data_Job_Setup t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

update t
set
t.Previousinstaller = e.ETALoginId
from
tbl_Data_Job_Setup t 
inner join tbl_TechCodeToETALoginId e on t.Previousinstaller = e.TechCode
where t.Previousinstaller is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_TechToLocation t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_HourlyInvoiceMaster t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

update t
set
t.LastUser = e.ETALoginId
from
tbl_HourlyInvoiceMaster t 
inner join tbl_TechCodeToETALoginId e on t.LastUser = e.TechCode
where t.LastUser is not null

----------------------------

update t
set
t.TechCode = e.ETALoginId
from
tbl_HourlyTechToPayrollClass t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.TechCode
where t.TechCode is not null

----------------------------


update t
set
t.FSMAssigned = e.ETALoginId
from
tbl_Data_Damage t 
inner join tbl_TechCodeToETALoginId e on t.FSMAssigned = e.TechCode
where t.FSMAssigned is not null

----------------------------

update t
set
t.TechNo = e.ETALoginId
from
tbl_InvCategory2Tech t 
inner join tbl_TechCodeToETALoginId e on t.TechNo = e.TechCode
where t.TechNo is not null

----------------------------

update t
set
t.TechNumber = e.ETALoginId
from
tbl_EmployeeInformationAudit t 
inner join tbl_TechCodeToETALoginId e on t.TechNumber = e.TechCode
where t.TechNumber is not null

----------------------------

update t
set
t.TechNumber = e.ETALoginId
from
tbl_DishSHS_Data t 
inner join tbl_TechCodeToETALoginId e on t.TechNumber = e.TechCode
where t.TechNumber is not null

update t
set
t.SELLER = e.ETALoginId
from
tbl_DishSHS_Data t 
inner join tbl_TechCodeToETALoginId e on t.SELLER = e.TechCode
where t.SELLER is not null

update t
set
t.LastEventTechID = e.ETALoginId
from
tbl_DishSHS_Data t 
inner join tbl_TechCodeToETALoginId e on t.LastEventTechID = e.TechCode
where t.LastEventTechID is not null

----------------------------

update t
set
t.TechNumber = e.ETALoginId
from
tbl_Data_Employees t 
inner join tbl_TechCodeToETALoginId e on t.TechNumber = e.TechCode
where t.TechNumber is not null	

----------------------------

update t
set
t.TechReported = e.ETALoginId
from
tbl_WOToNLOSMaster t 
inner join tbl_TechCodeToETALoginId e on t.TechReported = e.TechCode
where t.TechReported is not null	

----------------------------

update t
set
t.TechResponsible = e.ETALoginId
from
tbl_Damages_ClaimsMaster t 
inner join tbl_TechCodeToETALoginId e on t.TechResponsible = e.TechCode
where t.TechResponsible is not null	

----------------------------

update t
set
t.UserId = e.ETALoginId
from
tbl_InvParticipant2User t 
inner join tbl_TechCodeToETALoginId e on t.UserId = e.TechCode
where t.UserId is not null	


----------------------------

update t
set
t.UserId = e.ETALoginId
from
tbl_Mobility_UserToDevice t 
inner join tbl_TechCodeToETALoginId e on t.UserId = e.TechCode
where t.UserId is not null	


----------------------------

update t
set
t.UserId = e.ETALoginId
from
tbl_User t 
inner join tbl_TechCodeToETALoginId e on t.UserId = e.TechCode
where t.UserId is not null	

update t
set
t.ETADirectExternalId = e.NewETADirectExternalId
from
tbl_User t 
inner join tbl_TechCodeToOldETADirectExternalIdToNewETADirectExternalId e on t.UserId = e.TechCode
where t.UserId is not null	
 

----------------------------

update t
set
t.UserId = e.ETALoginId
from
tbl_WOTimes t 
inner join tbl_TechCodeToETALoginId e on t.UserId = e.TechCode
where t.UserId is not null	


----------------------------

update t
set
t.UserId = e.ETALoginId
from
tbl_GrouptoUser t 
inner join tbl_TechCodeToETALoginId e on t.UserId = e.TechCode
where t.UserId is not null	


----------------------------

update t
set
t.UserId = e.ETALoginId
from
tbl_UserToScreen t 
inner join tbl_TechCodeToETALoginId e on t.UserId = e.TechCode
where t.UserId is not null	

