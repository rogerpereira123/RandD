select * from tbl_IVR_ClockOut
update tbl_IVR_ClockOut set CreatedOn = GETDATE(), WorkOrderConnectivityTypeName = 'Not Connected' , ConnectivityConfirmationNumber = '' where WorkOrderNumber = '34108223800112006'
Update tbl_WOTimes set Clock_Out = null where WONumber = '34108223800112006'
exec usp_RemoveClosedWOEquipments '34108223800112006'
delete from tbl_IVR_EquipmentDiscrepancy where WONumber = '34108223800112006'
delete from tbl_Acct_Notes where CustomerId = 924599
delete from tbl_IVR_EquipmentUtilized where WorkOrderNumber = '34108223800112006'
select * from tbl_Data_Customers 
tdc inner join tbl_Data_Job_Setup tjs on tjs.CustomerID = tdc.CUSTOMERID where tjs.WONumber = '34108223800112006'