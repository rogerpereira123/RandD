select distinct w2.FileName from w2 
inner join tbl_Data_Employees tde on  substring(FileName, 1,  CHARINDEX('-',FileName,1) - 1) = tde.EmployeeNumber
inner join tbl_User u on tde.EmployeeID = u.EmployeeID 
where u.Active = 0 
and u.EmployeeID not in (select uinner.EmployeeID from tbl_User uinner where uinner.EmployeeID = u.EmployeeID and uinner.Active = 1)


