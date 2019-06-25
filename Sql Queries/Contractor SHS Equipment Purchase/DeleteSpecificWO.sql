declare @WONumber varchar(20) = '1001751022003011'
delete wlpl from 
tbl_Payroll_ReimbursementInvoiceWorkOrderLine wl inner join 
tbl_Payroll_ReimbursementInvoiceWOLineToProductLine wlpl on wl.WorkOrderLineId = wlpl.WorkOrderLineId
where wl.WONumber = @WONumber

delete wl from 
tbl_Payroll_ReimbursementInvoiceWorkOrderLine wl
where wl.WONumber = @WONumber


delete
rim
from
tbl_Payroll_ReimbursementInvoiceMaster rim 
LEFT join tbl_Payroll_ReimbursementInvoiceWorkOrderLine wl on rim.InvoiceId = wl.InvoiceId
where
wl.InvoiceId is null
