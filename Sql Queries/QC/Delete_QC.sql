declare @WONumber varchar(20)
set @WONumber = '1000253289063011'

delete tbl_RevisedQC_SignalStrength
from tbl_RevisedQC_QCMaster q 
where q.WONumber = @WONumber and  q.QCId = tbl_RevisedQC_SignalStrength.QCId
delete tbl_RevisedQC_Evaluation
from tbl_RevisedQC_QCMaster q  where q.WONumber = @WONumber and  q.QCId = tbl_RevisedQC_Evaluation.QCId
delete from tbl_RevisedQC_QCMaster where WONumber = @WONumber


delete from tbl_InvoiceToPayrollParametersAdditionsDeductions where ActivityRelatedWorkOrder = @WONumber