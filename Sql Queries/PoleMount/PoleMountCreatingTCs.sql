declare @PoleMount table
(
InstallWONumber varchar(20),
InstallTech varchar(20),
PoleMountWoNumber varchar(20),
PoleMountTech varchar(20),
Location varchar(200)
)

declare @StartDate date = '03/01/2014'
declare @EndDate date = '03/31/2014'
declare @TCType int = 12


insert into @PoleMount
select
distinct tjs.WONumber, tjs.TechCode , tjsFollow.WONumber, tjsFollow.TechCode ,  ISNULL( w.WarehouseName, wSup.WarehouseName)
from 
tbl_Data_Job_Setup tjs
inner join tbl_Data_Job_Setup tjsFollow on tjs.CustomerID = tjsFollow.CustomerID
left join tbl_InvParticipant2User ip2u on tjs.TechCode = ip2u.UserId
left join tbl_Warehouse w on ip2u.InvParticipantId = w.InvParticipantId
inner join tbl_ZIPtoSupervisor zts on tjs.CustomerZip = zts.ZipCode
inner join tbl_InvParticipant2User ip2uSUp on zts.Supervisor = ip2uSUp.UserId
inner join tbl_Warehouse wSup on wSup.InvParticipantId = ip2uSUp.InvParticipantId
where
tjsFollow.servicecodes like '%2~%'
/*and
tjsFollow.WorkorderType in ( 'CH' , 'TC' , 'SC')*/
and
tjsFollow.SaleDate > tjs.CSGLastChangedDate
and
tjsFollow.WONumber <> tjs.WONumber
/*and
tjs.WorkorderType in ('NC' , 'RC', 'RS')*/
and
tjs.CSGLastChangedDate >= @StartDate
and
tjs.CSGLastChangedDate <= @EndDate
and
tjs.CSGStatus in ('C' , 'D')
and
tjsFollow.CSGStatus in ('C' , 'D')

--select *  from @PoleMount order by Location



declare @TC table
( CustomerName varchar(500), Phone varchar(20) , Location varchar(200),  AccountNo varchar(20), InstallJob varchar(20), InstallType varchar(10), InstallClosedDate date, InstallTech varchar(20),
  PoleMountJob varchar(20) , PoleMountType varchar(10), PoleMountClosedDate date, PoleMountTech varchar(20), 
  TCJob varchar(20), TCType varchar(20), TCStatus varchar(10), TCCreatedDate date, CustId bigint)


declare @TCInternal table
( CustomerName varchar(500), Phone varchar(20) , Location varchar(200),  AccountNo varchar(20), InstallJob varchar(20), InstallType varchar(10), InstallClosedDate date, InstallTech varchar(20),
  PoleMountJob varchar(20) , PoleMountType varchar(10), PoleMountClosedDate date, PoleMountTech varchar(20), 
  TCJob varchar(20), TCType varchar(20), TCStatus varchar(10), TCCreatedDate date, CustId bigint)



insert into @TC
select
tdc.NAME as CustomerName, tdc.PHONE  , p.Location, tdc.ACCOUNTNO,install.WONumber as InstallJob,install.WorkorderType as InstallType, install.CSGLastChangedDate as InstallClosedDate,install.TechCode as InstallTech, 
 pole.WONumber as PoleMountJob,pole.WorkorderType as PoleMountType, pole.CSGLastChangedDate as PoleMountClosedDate,pole.TechCode as PoleMountTech, 
 tc.WONumber as TCJob,tc.WorkorderType as TCType, tc.CSGStatus as TCStatus, tc.SaleDate as TCCreatedDate, tdc.CUSTOMERID
from @PoleMount
p inner join tbl_Data_Job_Setup pole on p.PoleMountWoNumber = pole.WONumber
inner join tbl_Data_Job_Setup install on p.InstallWONumber = install.WONumber
inner join tbl_Data_Job_Setup tc on install.CustomerID = tc.CustomerID
inner join tbl_Data_Customers tdc on pole.CustomerID = tdc.CUSTOMERID
inner join tbl_ZIPtoSupervisor zts on tdc.ZIPCODE = zts.ZipCode
where
DATEDIFF(day,install.CSGLastChangedDate, tc.SaleDate) >= 0
and
DATEDIFF(day,install.CSGLastChangedDate, tc.SaleDate) <= @TCType
and tc.WorkorderType in ('TC' , 'SC') 
and install.WONumber < tc.WONumber
order by Location,InstallClosedDate

delete from @TC 
		from (select t.PoleMountJob as OrgJobFilter , MIN(convert(bigint, t.TCJob )) as MinTCJob from @TC as t  group by t.PoleMountJob having COUNT(t.PoleMountJob) > 1) as filter
		where convert(bigint, TCJob) > convert(bigint,filter.MinTCJob) and PoleMountJob = filter.OrgJobFilter
		
		
delete from @TC
		from (select t.TCJOb as TCJobFilter , max(convert(bigint, t.PoleMountJob )) as MaxOrgJob from @TC as t group by t.TCJob having COUNT(t.TCjob) > 1) as filter
		where convert(bigint, PoleMountJob) < convert(bigint,filter.MaxOrgJob) and TCJob = filter.TCJobFilter
		
		delete @TC
		from tbl_Data_Job_Setup tjs 
		where convert(bigint,tjs.WONumber)  between convert(bigint,PoleMountJob ) and convert(bigint, TCJob)
		and tjs.csgStatus = 'C' and tjs.csglastchangedDate > @enddate and CustID = tjs.CustomerID  and tjs.WorkorderType not in ('TC' , 'SC') 
		
		delete @TC
		from tbl_Data_Job_Setup tjsInner
		where tjsInner.CustomerID = CustID and  tjsInner.CSGLastChangedDate >= PoleMountClosedDate and tjsInner.CSGLastChangedDate <= TCCreatedDate
     	 and tjsInner.TechCode <> PoleMountTech and tjsInner.WONumber <> PoleMountJob and tjsInner.WONumber <> TCJob and tjsInner.CSGStatus = 'C'
		
insert into @TCInternal

select
tdc.NAME as CustomerName, tdc.PHONE  , p.Location, tdc.ACCOUNTNO,install.WONumber as InstallJob,install.WorkorderType as InstallType, install.CSGLastChangedDate as InstallClosedDate,install.TechCode as InstallTech, 
 pole.WONumber as PoleMountJob,pole.WorkorderType as PoleMountType, pole.CSGLastChangedDate as PoleMountClosedDate,pole.TechCode as PoleMountTech, 
 tc.WONumber as TCJob,tc.WorkorderType as TCType, tc.Status as TCStatus, tc.CreatedDt as TCCreatedDate, tdc.CUSTOMERID
from @PoleMount
p inner join tbl_Data_Job_Setup pole on p.PoleMountWoNumber = pole.WONumber
inner join tbl_Data_Job_Setup install on p.InstallWONumber = install.WONumber
inner join InternalWorkOrder tc on install.CustomerID = tc.CustomerID
inner join tbl_Data_Customers tdc on pole.CustomerID = tdc.CUSTOMERID
inner join tbl_ZIPtoSupervisor zts on tdc.ZIPCODE = zts.ZipCode
where
DATEDIFF(day,pole.CSGLastChangedDate, tc.CreatedDt) >= 0
and
DATEDIFF(day,pole.CSGLastChangedDate, tc.CreatedDt) <= @TCType
and tc.WorkorderType in ('HW') 
order by Location,InstallClosedDate


delete from @TCInternal 
		from (select t.PoleMountJob as OrgJobFilter , MIN(t.TCCreatedDate) as MinTCJobCreatedDate from @TC as t group by t.PoleMountJob having COUNT(t.PoleMountJob) > 1) as filter
		where TCCreatedDate > filter.MinTCJobCreatedDate and PoleMountJob = filter.OrgJobFilter
		
		delete from @TCInternal 
		from (select t.PoleMountJob as OrgJobFilter , MIN(convert(bigint, t.TCJob)) as MinTCJob from @TC as t where ISNUMERIC(t.TCJob) =1 group by t.PoleMountJob having COUNT(t.PoleMountJob) > 1) as filter
		where convert(bigint, TCJob) >convert(bigint,  filter.MinTCJob) and PoleMountJob = filter.OrgJobFilter and ISNUMERIC(TCJob) = 1
		
		delete from @TCInternal
		from (select t.TCJOb as TCJobFilter , max(t.PoleMountClosedDate) as MaxOrgJobCompletedDate from @TC as t group by t.TCJob having COUNT(t.TCjob) > 1) as filter
		where PoleMountClosedDate < filter.MaxOrgJobCompletedDate and TCJob = filter.TCJobFilter 
		
		delete from @TCInternal
		from (select t.TCJOb as TCJobFilter , max(convert(bigint, t.PoleMountJob )) as MaxOrgJob from @TC as t where ISNUMERIC(t.PoleMountJob) = 1 group by t.TCJob having COUNT(t.TCjob) > 1) as filter
		where convert(bigint, PoleMountJob ) < convert(bigint,  filter.MaxOrgJob) and TCJob = filter.TCJobFilter and ISNUMERIC(PoleMountJob) = 1
		
		
		
		delete @TCInternal
		from InternalWorkOrder tjsInner
		where tjsInner.CustomerID = CustID and  tjsInner.LastupdatedDt >= PoleMountClosedDate and tjsInner.LastupdatedDt <= TCCreatedDate
     	 and tjsInner.TechCode <> PoleMountTech and tjsInner.WONumber <> PoleMountJob and tjsInner.WONumber <> TCJob and tjsInner.Status = 'C'
     	 
     	 delete @TCInternal
		from tbl_Data_Job_Setup tjsInner
		where tjsInner.CustomerID = CustID and  tjsInner.CSGLastChangedDate >= PoleMountClosedDate and tjsInner.CSGLastChangedDate <= TCCreatedDate
     	 and tjsInner.TechCode <> PoleMountTech and tjsInner.WONumber <> PoleMountJob and tjsInner.WONumber <> TCJob and tjsInner.CSGStatus = 'C'
     	 
     	 
     	 
    select * from @TC
    select * from @TCInternal