select * from tbl_ReviewSystem_ReviewMaster
select * from tbl_ReviewSystem_ReviewToPerformanceParameters
select * from tbl_ReviewSystem_ReviewToQuestionAnswers
select * from tbl_ReviewSystem_ReviewToWorkOrder

/*
truncate table tbl_ReviewSystem_ReviewToWorkOrder
truncate table tbl_ReviewSystem_ReviewToQuestionAnswers
truncate table tbl_ReviewSystem_ReviewToPerformanceParameters
delete from tbl_ReviewSystem_ReviewMaster

DBCC CHECKIDENT (tbl_ReviewSystem_ReviewMaster, reseed, 0)

*/
