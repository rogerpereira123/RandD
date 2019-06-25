
delete rim
from tbl_Payroll_ReimbursementInvoiceMaster rim 
where InvoiceStatusId = 1


delete wl
from tbl_Payroll_ReimbursementInvoiceMaster rim 
inner join tbl_Payroll_ReimbursementInvoiceWorkOrderLine wl on rim.InvoiceId = wl.InvoiceId
where InvoiceStatusId = 1

delete wlpl
from tbl_Payroll_ReimbursementInvoiceMaster rim 
inner join tbl_Payroll_ReimbursementInvoiceWorkOrderLine wl on rim.InvoiceId = wl.InvoiceId
inner join tbl_Payroll_ReimbursementInvoiceWOLineToProductLine wlpl on wlpl.WorkOrderLineId = wl.WorkOrderLineId
where InvoiceStatusId = 1 and PayStatus = '00'