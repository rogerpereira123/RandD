--select * from DishPayment

select * from tbl_ReconMaster where reconId in(
select ReconId from tbl_ReconMaster rm inner join DishPayment d on rm.WONumber = d.[Work Order No] and rm.DishTaskDescription = d.[Task Description or R00])


select * from tbl_DishPayment where SrNo in (
select SrNo from tbl_DishPayment dp inner join DishPayment d on dp.WONumber = d.[Work Order No] and dp.TaskDescription = d.[Task Description or R00])


