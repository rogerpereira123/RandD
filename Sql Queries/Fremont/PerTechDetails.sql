declare @TechCode varchar(10) = '6642'
declare @PayrollStartDate date = '09/14/2011'
declare @PayrollEndDate date = '09/27/2011'
declare @BeginingOfTheYear date = (select '01/01/' + rtrim(ltrim(str(DATEPART(year, @PayrollStartDate)))))
declare @ZiCode varchar(5) = '43420'
declare @zipcodes table
(
	zipcode varchar(10)
)
declare @BeforePayroll table
(
	CompletedDate date,
	PointsCompleted int
	
)
declare @DuringPayroll table
(
	CompletedDate date,
	PointsCompleted int
	
)
insert into @zipcodes
select distinct zipcode from freemont
insert into @BeforePayroll

select CSGLastChangedDate,SUM(tjs.WorkUnits) as PointsCompleted from tbl_Data_Job_Setup tjs
inner join tbl_CustomerToZipExtension cze on tjs.CustomerID = cze.CustomerId
inner join @zipcodes z on z.zipcode = cze.ZipCode
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
where TechCode = @TechCode
and CSGStatus ='C'
and CSGLastChangedDate >= @BeginingOfTheYear and
CSGLastChangedDate < @PayrollStartDate and
tdc.ZIPCODE = @ZiCode
group by CSGLastChangedDate
union
select  LastupdatedDt,SUM(tjs.Points) as PointsCompleted from InternalWorkOrder tjs
inner join tbl_CustomerToZipExtension cze on tjs.CustomerID = cze.CustomerId
inner join @zipcodes z on z.zipcode = cze.ZipCode
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
where TechCode = @TechCode
and Status ='C'
and LastupdatedDt >= @BeginingOfTheYear and
LastupdatedDt < @PayrollStartDate and tdc.ZIPCODE = @ZiCode
group by LastupdatedDt


select CompletedDate, SUM(pointscompleted) as PointsCompleted from @BeforePayroll group by CompletedDate

insert into @DuringPayroll
select CSGLastChangedDate,SUM(tjs.WorkUnits) as PointsCompleted  from tbl_Data_Job_Setup tjs
inner join tbl_CustomerToZipExtension cze on tjs.CustomerID = cze.CustomerId
inner join @zipcodes z on z.zipcode = cze.ZipCode
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
where TechCode = @TechCode
and CSGStatus ='C'
and CSGLastChangedDate >= @PayrollStartDate and
CSGLastChangedDate <= @PayrollEndDate and tdc.ZIPCODE = @ZiCode
group by CSGLastChangedDate
union
select LastupdatedDt,SUM(tjs.Points) as PointsCompleted from InternalWorkOrder tjs
inner join tbl_CustomerToZipExtension cze on tjs.CustomerID = cze.CustomerId
inner join @zipcodes z on z.zipcode = cze.ZipCode
inner join tbl_Data_Customers tdc on tjs.CustomerID = tdc.CUSTOMERID
where TechCode = @TechCode
and Status ='C'
and LastupdatedDt >= @PayrollStartDate and
LastupdatedDt <= @PayrollEndDate and tdc.ZIPCODE = @ZiCode
group by LastupdatedDt

select CompletedDate, SUM(pointscompleted) as PointsCompleted from @DuringPayroll group by CompletedDate