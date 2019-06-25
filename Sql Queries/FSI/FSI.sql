declare @PayrollStartDate date = '08/01/2012'
declare @PayrollEndDate date 
set @PayrollEndDate = DATEADD(day , 13 , @PayrollStartDate)
declare @ConnectivityStartDate date
declare @ConnectivityEndDate date
set @ConnectivityStartDate = DATEADD(day, -28 , @PayrollStartDate)
set @ConnectivityEndDate = DATEADD(day, 13 , @ConnectivityStartDate)



declare @FSI table
(
TechNumber varchar(10),
PointsPerHour float,
TC12 float,
CSAT float,
IPConnectivity float,
FSILevel varchar(10)
)

insert into @FSI (TechNumber , PointsPerHour , TC12 ,CSAT,IPConnectivity , FSILevel)
select TechCode , case when Week1Hours + Week2Hours = 0 then 0.0 else (Week1Points + Week2Points) / (Week1Hours + Week2Hours) end , Week1TC12Percentages,Week1CSATScore,0, ''  from tbl_TechPayrollDetails where PayrollStartDate = @PayrollStartDate

 

update @FSI
set IPConnectivity = (dbo.udf_getConnectivityPercentage(@ConnectivityStartDate , @ConnectivityEndDate , TechNumber))


update @FSI set FSILevel = 'FSI4' where PointsPerHour >= 6 and TC12 < 4 and CSAT >= 9.7 and IPConnectivity >= 32
update @FSI set FSILevel = 'FSI3' where PointsPerHour >= 5 and PointsPerHour  < 6 and TC12 < 4.5 and CSAT >= 9.6 and IPConnectivity >= 31 and FSILevel = ''
update @FSI set FSILevel = 'FSI2' where PointsPerHour >= 4.5 and PointsPerHour  < 5 and TC12 < 5 and CSAT >= 9.5 and IPConnectivity >= 30 and FSILevel = ''
update @FSI set FSILevel = 'FSI1' where FSILevel = ''

select TechNumber , FSILevel , ROUND(PointsPerHour , 2, 2) as PointsPerHour , ROUND(TC12 , 2, 2) as TC12 , ROUND(CSAT , 2 ,2 ) as CSAT , ROUND(IPConnectivity , 2,2) as IPConnectivity  from @FSI
order by FSILevel

select FSILevel , COUNT(TechNumber) as Count from @FSI 
group by FSILevel 


 
  
  
  