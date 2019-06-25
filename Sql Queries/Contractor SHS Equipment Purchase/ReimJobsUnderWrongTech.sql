select
distinct w.WONumber , wp.PayStatus, i.TechCode InvoiceTechCode , tjs.TechCode as JobSetupTechCode
from tbl_Payroll_ReimbursementInvoiceMaster i
inner join tbl_Payroll_ReimbursementInvoiceWorkOrderLine w on i.InvoiceId = w.InvoiceId
inner join tbl_Payroll_ReimbursementInvoiceWOLineToProductLine wp on w.WorkOrderLineId = wp.WorkOrderLineId
inner join tbl_Data_Job_Setup tjs on tjs.WONumber = w.WONumber
inner join TTSView tts1 on i.TechCode = tts1.TechCode
inner join TTSView tts2 on tjs.TechCode = tts2.TechCode
where
i.TechCode <> tjs.TechCode
and tts1.VendorId <> tts2.VendorId
