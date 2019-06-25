delete from tbl_InvoiceLineToServiceCodeDeciderData 


delete ilts from tbl_InvoiceMaster im 
inner join tbl_InvoiceLine il on im.InvoiceId = il.invoiceId 
inner join tbl_InvoiceLineToServiceCode ilts on il.InvoiceLineId = ilts.InvoiceLineId
where CreateDate = '01/05/2015'

delete il from tbl_InvoiceMaster im 
inner join tbl_InvoiceLine il on im.InvoiceId = il.invoiceId where CreateDate = '01/05/2015'


delete from tbl_InvoiceMaster where CreateDate = '01/05/2015'


