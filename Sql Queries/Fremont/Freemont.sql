declare @PayrollStartDate date = '09/14/2011'
declare @PayrollEndDate date = '09/27/2011'
declare @BeginingOfTheYear date = (select '01/01/' + rtrim(ltrim(str(DATEPART(year, @PayrollStartDate)))))
declare @ZipCode varchar(5) = '43420'

declare @BeforePayroll table
(
	TechCode varchar(10),
	CompletedDate date
	
)

declare @DuringPayroll table
(
	TechCode varchar(10),
	CompletedDate date
	
)

declare @Result table
(
	TechCode varchar(10),
	DateCount int
)

declare @zipcodes table
(
	zipcode varchar(10)
)

insert into @zipcodes
select distinct zipcode from freemont

insert into @BeforePayroll
select distinct tjs.TechCode, tjs.CSGLastChangedDate  from 
tbl_Data_Job_Setup tjs
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID


--inner join freemont f on tdc.ADDRESS = f.Address
inner join tbl_CustomerToZipExtension cze on tjs.CustomerID = cze.CustomerId
inner join @zipcodes z on z.zipcode = cze.ZipCode


where
tjs.CSGLastChangedDate>=@BeginingOfTheYear
and
tjs.CSGLastChangedDate < @PayrollStartDate
and
CSGStatus = 'C' 
and
tdc.ZIPCODE = @ZipCode
and
tjs.TechCode not like 'ret%'
and
tjs.TechCode not in (select distinct techcode from tbl_TechToPayrollClass where InvoiceClassId in ('CD' , 'CT' , 'ME' , 'M2' , 'M3' , 'M4', 'M5'))
--group by TechCode 


insert into @BeforePayroll
select distinct tjs.TechCode , tjs.LastupdatedDt  from 
InternalWorkOrder tjs
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID

--inner join freemont f on tdc.ADDRESS = f.Address
inner join tbl_CustomerToZipExtension cze on tjs.CustomerID = cze.CustomerId
inner join @zipcodes z on z.zipcode = cze.ZipCode

where
tjs.LastupdatedDt>=@BeginingOfTheYear
and
tjs.LastupdatedDt < @PayrollStartDate
and
Status = 'C' 
and
tdc.ZIPCODE = @ZipCode
and
tjs.TechCode not like 'ret%'
and
tjs.TechCode not in (select distinct techcode from tbl_TechToPayrollClass where InvoiceClassId in ('CD' , 'CT' , 'ME' , 'M2' , 'M3' , 'M4', 'M5'))
--group by TechCode 

insert into @BeforePayroll 
select distinct * from @BeforePayroll


insert into @DuringPayroll
select distinct tjs.TechCode , tjs.CSGLastChangedDate  from 
tbl_Data_Job_Setup tjs
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID

--inner join freemont f on tdc.ADDRESS = f.Address
inner join tbl_CustomerToZipExtension cze on tjs.CustomerID = cze.CustomerId
inner join @zipcodes z on z.zipcode = cze.ZipCode

inner join (select TechCode , count(CompletedDate) as DateCount from @BeforePayroll group by TechCode ) as bp on bp.TechCode = tjs.TechCode
where
tjs.CSGLastChangedDate>=@PayrollStartDate
and
tjs.CSGLastChangedDate <= @PayrollEndDate
and
CSGStatus = 'C' 
and
tdc.ZIPCODE = @ZipCode
and
tjs.TechCode not like 'ret%'
and
tjs.TechCode not in (select distinct techcode from tbl_TechToPayrollClass where InvoiceClassId in ('CD' , 'CT' , 'ME' , 'M2' , 'M3' , 'M4', 'M5'))

--group by tjs.TechCode 

insert into @DuringPayroll
select tjs.TechCode , tjs.LastupdatedDt from 
InternalWorkOrder tjs
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
--inner join freemont f on tdc.ADDRESS = f.Address
inner join tbl_CustomerToZipExtension cze on tjs.CustomerID = cze.CustomerId
inner join @zipcodes z on z.zipcode = cze.ZipCode
inner join (select TechCode , count(CompletedDate) as DateCount from @BeforePayroll group by TechCode) as bp on bp.TechCode = tjs.TechCode
where
tjs.LastupdatedDt>=@PayrollStartDate
and
tjs.LastupdatedDt <= @PayrollEndDate
and
Status = 'C' 
and
tdc.ZIPCODE = @ZipCode
and
tjs.TechCode not like 'ret%'
and
tjs.TechCode not in (select distinct techcode from tbl_TechToPayrollClass where InvoiceClassId in ('CD' , 'CT' , 'ME' , 'M2' , 'M3' , 'M4', 'M5'))

--group by tjs.TechCode 

insert into @DuringPayroll
select distinct * from @DuringPayroll


insert into @Result
select TechCode, COUNT(CompletedDate) from(
select * from @BeforePayroll where TechCode in (select TechCode from @DuringPayroll)
union
select * from @DuringPayroll) as result group by result.TechCode having COUNT(CompletedDate) > 12

select * from @Result

/*select bp.*,tjs.CSGLastChangedDate as CompletedDate ,
tdc.ADDRESS , tdc.PHONE , tdc.ZIPCODE
from @BeforePayroll bp 
inner join @Result r on bp.TechCode = r.TechCode
inner join tbl_Data_Job_Setup tjs on bp.WONumber = tjs.WONumber
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID

union
select bp.*,tjs.LastupdatedDt as CompletedDate ,
tdc.ADDRESS , tdc.PHONE , tdc.ZIPCODE
from @BeforePayroll bp 
inner join @Result r on bp.TechCode = r.TechCode
inner join InternalWorkOrder tjs on bp.WONumber = tjs.WONumber
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID

select dp.* ,tjs.CSGLastChangedDate as CompletedDate ,
tdc.ADDRESS , tdc.PHONE , tdc.ZIPCODE
from @DuringPayroll dp 
inner join @Result r on dp.TechCode = r.TechCode
inner join tbl_Data_Job_Setup tjs on dp.WONumber = tjs.WONumber
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID

union

select dp.* ,tjs.LastupdatedDt as CompletedDate ,
tdc.ADDRESS , tdc.PHONE , tdc.ZIPCODE
from @DuringPayroll dp 
inner join @Result r on dp.TechCode = r.TechCode
inner join InternalWorkOrder tjs on dp.WONumber = tjs.WONumber
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID*/