declare @DuplicateAccounts table ( AccountNumber varchar(100) , CustomerId bigint, WONumber varchar(20)) 
insert into @DuplicateAccounts
select cust.ACCOUNTNO, cust.CUSTOMERID ,tjs.WONumber
from tbl_Data_Customers cust 
inner join (
select tdc.ACCOUNTNO
 from tbl_Data_Customers tdc
where tdc.ACCOUNTNO not like '9999%'
group by tdc.ACCOUNTNO having COUNT(tdc.AccountNo) > 1 ) as c on cust.ACCOUNTNO = c.ACCOUNTNO
inner join tbl_Data_Job_Setup tjs on cust.CUSTOMERID = tjs.CustomerID

select * from @DuplicateAccounts order by AccountNumber , CustomerId

declare @WoNumber varchar(20)
declare @CustomerId bigint
declare @AccountNo varchar(20)
while(exists(select * from @DuplicateAccounts))
begin
select top 1 @WoNumber =  WONumber ,@CustomerId = CustomerId , @AccountNo = AccountNumber  from @DuplicateAccounts

update tbl_Data_Job_Setup set
CustomerID = @CustomerId 
where
WONumber in ( select WONumber from @DuplicateAccounts where AccountNumber= @AccountNo)

delete from tbl_Data_Customers where CUSTOMERID not in ( select CUSTOMERID from tbl_Data_Job_Setup) and ACCOUNTNO not like '9999%' and ACCOUNTNO = @AccountNo

delete from @DuplicateAccounts where AccountNumber = @AccountNo

end



