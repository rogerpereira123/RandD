declare  @who table (SPID int , Status varchar(2000) , Login varchar(2000) , HostName varchar(2000) , BlkBy varchar(2000) , DBName  varchar(2000) , Command varchar(2000) , CPUTime int , DiskIO int , 
LastBatch varchar(2000)  , ProgramName varchar(2000) , SPIDDup int, RequestId int)

insert into @who
exec sp_who2


select * from @who where DBName = 'Northware' --and ProgramName = '.Net SqlClient Data Provider                  '

--kill 97