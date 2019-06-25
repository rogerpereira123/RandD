update t
set
t.TechCode = e.TechCode
from
tbl_TechDayEndProcessEventLog t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_TechToFSM t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

update t
set
t.FSM = e.TechCode
from
tbl_TechToFSM t 
inner join tbl_TechCodeToETALoginId e on t.FSM = e.ETALoginId
where t.FSM is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_TS_TechStatusNotes t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null


----------------------------

update t
set
t.Supervisor = e.TechCOde
from
tbl_ZIPtoSupervisor t 
inner join tbl_TechCodeToETALoginId e on t.Supervisor = e.ETALoginId
where t.Supervisor is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_Payroll_ReimbursementInvoiceMaster t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_TechCheckInTimes t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_TechDayEndProcess t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_ContractorPayrollDetails t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_daily_opportunities t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_DailyMilageTracker t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.RevieweeUserId = e.TechCode
from
tbl_ReviewSystem_ReviewMaster t 
inner join tbl_TechCodeToETALoginId e on t.RevieweeUserId = e.ETALoginId
where t.RevieweeUserId is not null

update t
set
t.ReviewerUserId = e.TechCode
from
tbl_ReviewSystem_ReviewMaster t 
inner join tbl_TechCodeToETALoginId e on t.ReviewerUserId = e.ETALoginId
where t.ReviewerUserId is not null



----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_DishConnectivity t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

update t
set
t.TechCode = e.TechCode
from
tbl_DishConnectivity t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_IVR_EquipmentDiscrepancy t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_InvoiceMaster t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
InternalWorkOrder t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

update t
set
t.OriginalInstaller = e.TechCode
from
InternalWorkOrder t 
inner join tbl_TechCodeToETALoginId e on t.OriginalInstaller = e.ETALoginId
where t.OriginalInstaller is not null


update t
set
t.LastInstaller = e.TechCode
from
InternalWorkOrder t 
inner join tbl_TechCodeToETALoginId e on t.LastInstaller = e.ETALoginId
where t.LastInstaller is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_TechToPayrollClass t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_DishPayment t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

update t
set
t.TechCode = e.TechCode
from
tbl_DishPayment t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_InvoicePaperwork t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_HourlyTechToPayrollParameterConfiguration t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_TS_TechETA t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_TechtoSupervisor t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null


update t
set
t.Supervisor = e.TechCode
from
tbl_TechtoSupervisor t 
inner join tbl_TechCodeToETALoginId e on t.Supervisor = e.ETALoginId
where t.Supervisor is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_TechPayrollDetails t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_Mobility_InternalWorkOrderClosing t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_DishCustomerSurveyData t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

update t
set
t.TechCode = e.TechCode
from
tbl_DishCustomerSurveyData t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = ETALoginId
where t.TechCode is not null

----------------------------


update t
set
t.TechCode = e.TechCode
from
tbl_OutTechClockOut t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------


update t
set
t.Inspector = e.TechCode
from
tbl_QCSchedule t 
inner join tbl_TechCodeToETALoginId e on t.Inspector = e.ETALoginId
where t.Inspector is not null

update t
set
t.AssignedBy = e.TechCode
from
tbl_QCSchedule t 
inner join tbl_TechCodeToETALoginId e on t.AssignedBy = e.ETALoginId
where t.AssignedBy is not null

----------------------------

update t
set
t.Inspector = e.TechCode
from
tbl_RevisedQC_QCMaster t 
inner join tbl_TechCodeToETALoginId e on t.Inspector = e.ETALoginId
where t.Inspector is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_OutTechClockIn t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_Data_Job_Setup t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

update t
set
t.Previousinstaller = e.TechCode
from
tbl_Data_Job_Setup t 
inner join tbl_TechCodeToETALoginId e on t.Previousinstaller = e.ETALoginId
where t.Previousinstaller is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_TechToLocation t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_HourlyInvoiceMaster t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

update t
set
t.LastUser = e.TechCode
from
tbl_HourlyInvoiceMaster t 
inner join tbl_TechCodeToETALoginId e on t.LastUser = e.ETALoginId
where t.LastUser is not null

----------------------------

update t
set
t.TechCode = e.TechCode
from
tbl_HourlyTechToPayrollClass t 
inner join tbl_TechCodeToETALoginId e on t.TechCode = e.ETALoginId
where t.TechCode is not null

----------------------------


update t
set
t.FSMAssigned = e.TechCode
from
tbl_Data_Damage t 
inner join tbl_TechCodeToETALoginId e on t.FSMAssigned = e.ETALoginId
where t.FSMAssigned is not null

----------------------------

update t
set
t.TechNo = e.TechCode
from
tbl_InvCategory2Tech t 
inner join tbl_TechCodeToETALoginId e on t.TechNo = e.ETALoginId
where t.TechNo is not null

----------------------------

update t
set
t.TechNumber = e.TechCode
from
tbl_EmployeeInformationAudit t 
inner join tbl_TechCodeToETALoginId e on t.TechNumber = e.ETALoginId
where t.TechNumber is not null

----------------------------

update t
set
t.TechNumber = e.TechCode
from
tbl_DishSHS_Data t 
inner join tbl_TechCodeToETALoginId e on t.TechNumber = e.ETALoginId
where t.TechNumber is not null

update t
set
t.SELLER = e.TechCode
from
tbl_DishSHS_Data t 
inner join tbl_TechCodeToETALoginId e on t.SELLER = e.ETALoginId
where t.SELLER is not null

update t
set
t.LastEventTechID = e.TechCode
from
tbl_DishSHS_Data t 
inner join tbl_TechCodeToETALoginId e on t.LastEventTechID = e.ETALoginId
where t.LastEventTechID is not null

----------------------------

update t
set
t.TechNumber = e.TechCode
from
tbl_Data_Employees t 
inner join tbl_TechCodeToETALoginId e on t.TechNumber = e.ETALoginId
where t.TechNumber is not null	

----------------------------

update t
set
t.TechReported = e.TechCode
from
tbl_WOToNLOSMaster t 
inner join tbl_TechCodeToETALoginId e on t.TechReported = e.ETALoginId
where t.TechReported is not null	

----------------------------

update t
set
t.TechResponsible = e.TechCode
from
tbl_Damages_ClaimsMaster t 
inner join tbl_TechCodeToETALoginId e on t.TechResponsible = e.ETALoginId
where t.TechResponsible is not null	

----------------------------

update t
set
t.UserId = e.TechCode
from
tbl_InvParticipant2User t 
inner join tbl_TechCodeToETALoginId e on t.UserId = e.ETALoginId
where t.UserId is not null	


----------------------------

update t
set
t.UserId = e.TechCode
from
tbl_Mobility_UserToDevice t 
inner join tbl_TechCodeToETALoginId e on t.UserId = e.ETALoginId
where t.UserId is not null	


----------------------------

update t
set
t.UserId = e.TechCode
from
tbl_User t 
inner join tbl_TechCodeToETALoginId e on t.UserId = e.ETALoginId
where t.UserId is not null	

----------------------------

update t
set
t.UserId = e.TechCode
from
tbl_WOTimes t 
inner join tbl_TechCodeToETALoginId e on t.UserId = e.ETALoginId
where t.UserId is not null	


----------------------------

update t
set
t.UserId = e.TechCode
from
tbl_GrouptoUser t 
inner join tbl_TechCodeToETALoginId e on t.UserId = e.ETALoginId
where t.UserId is not null	


----------------------------

update t
set
t.UserId = e.TechCode
from
tbl_UserToScreen t 
inner join tbl_TechCodeToETALoginId e on t.UserId = e.ETALoginId
where t.UserId is not null	
