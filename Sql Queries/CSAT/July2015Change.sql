declare @csat table(
Name varchar(200),
NumberOfSurveys int,
Status_Customer float,
Appearance float,
Dish_Placement varchar(200),
System_Verification varchar(200),
Explained_Basics float,
Clean_Up float,
Refer_Tech float,
Issue_Resolution varchar(200),
OverallScore float
)
insert into @csat
select 
'NC/RC',
Count(d.WONumber),
round(Sum(convert(float , d.Status_Customer)) / count(d.WONumber) , 2) as Status_Customer,
round(Sum(convert(float , d.Appearance)) / count(d.WONumber) , 2) as Appearance,
round(Sum(convert(float , d.Dish_Placement)) / count(d.WONumber) , 2) as Dish_PlaceMent,
round(Sum(convert(float , d.System_Verification)) / count(d.WONumber) , 2) as System_Verfification,
round(Sum(convert(float , d.Explained_Basics)) / count(d.WONumber) , 2) as Explained_Basics,
round(Sum(convert(float , d.Clean_Up)) / count(d.WONumber) , 2) as Clean_Up,
round(Sum(convert(float , d.Refer_Tech)) / count(d.WONumber) , 2) as Refer_Tech,
'N/A' as Issue_Resolution,
round(sum(round((d.Status_Customer + d.Appearance + d.Dish_Placement + d.System_Verification + d.Explained_Basics + d.Clean_Up + d.Refer_Tech) / 7.0 , 2)) /  count(d.WONumber) , 2)
from tbl_DishCustomerSurveyData d 
where CallDate = '07/01/2015'
and d.WOrkOrderType in ('NC' , 'RC' , 'RS')

insert into @csat
select 
'TC/SC',
Count(d.WONumber),
round(Sum(convert(float , d.Status_Customer)) / count(d.WONumber) , 2) as Status_Customer,
round(Sum(convert(float , d.Appearance)) / count(d.WONumber) , 2) as Appearance,
'N/A' as Dish_PlaceMent,
'N/A' as System_Verfification,
round(Sum(convert(float , d.Explained_Basics)) / count(d.WONumber) , 2) as Explained_Basics,
round(Sum(convert(float , d.Clean_Up)) / count(d.WONumber) , 2) as Clean_Up,
round(Sum(convert(float , d.Refer_Tech)) / count(d.WONumber) , 2) as Refer_Tech,
round(Sum(convert(float , isnull(d.Issue_Resolution , 0) )) / count(d.WONumber) , 2)  as Issue_Resolution,
round(sum((d.Status_Customer + d.Appearance   + d.Explained_Basics + d.Clean_Up + d.Refer_Tech + isnull(convert(float , d.Issue_Resolution ) , 0)) / 6.0) /  count(d.WONumber) , 2)
from tbl_DishCustomerSurveyData d 
where CallDate = '07/01/2015'
and d.WOrkOrderType in ('TC' , 'SC')

insert into @csat
select 
'UP/MV',
Count(d.WONumber),
round(Sum(convert(float , d.Status_Customer)) / count(d.WONumber) , 2) as Status_Customer,
round(Sum(convert(float , d.Appearance)) / count(d.WONumber) , 2) as Appearance,
round(Sum(convert(float , d.Dish_Placement)) / count(d.WONumber) , 2) as Dish_PlaceMent,
round(Sum(convert(float , d.System_Verification)) / count(d.WONumber) , 2) as System_Verfification,
round(Sum(convert(float , d.Explained_Basics)) / count(d.WONumber) , 2) as Explained_Basics,
round(Sum(convert(float , d.Clean_Up)) / count(d.WONumber) , 2) as Clean_Up,
round(Sum(convert(float , d.Refer_Tech)) / count(d.WONumber) , 2) as Refer_Tech,
'N/A' as Issue_Resolution,
round(sum(round((d.Status_Customer + d.Appearance + d.Dish_Placement + d.System_Verification + d.Explained_Basics + d.Clean_Up + d.Refer_Tech) / 7.0 , 2)) /  count(d.WONumber) , 2)
from tbl_DishCustomerSurveyData d 
where CallDate = '07/01/2015'
and d.WOrkOrderType in ('CH')

insert into @csat
select 
'Total',
Count(d.WONumber),
round(Sum(convert(float , d.Status_Customer)) / count(d.WONumber) , 2) as Status_Customer,
round(Sum(convert(float , d.Appearance)) / count(d.WONumber) , 2) as Appearance,
round(Sum(convert(float , isnull(d.Dish_Placement , 0))) / sum(case when d.WorkOrderType not in ('TC' , 'SC') then 1 else 0 end) , 2) as Dish_PlaceMent,
round(Sum(convert(float , isnull(d.System_Verification , 0))) / sum(case when d.WorkOrderType not in ('TC' , 'SC') then 1 else 0 end) , 2) as System_Verfification,
round(Sum(convert(float , d.Explained_Basics)) / count(d.WONumber) , 2) as Explained_Basics,
round(Sum(convert(float , d.Clean_Up)) / count(d.WONumber) , 2) as Clean_Up,
round(Sum(convert(float , d.Refer_Tech)) / count(d.WONumber) , 2) as Refer_Tech,
round(Sum(convert(float , isnull(d.Issue_Resolution , 0) )) / sum(case when d.WorkOrderType in ('TC' , 'SC') then 1 else 0 end) , 2)  as Issue_Resolution,
round(sum(round((d.Status_Customer + d.Appearance + isnull(d.Dish_Placement , 0) + isnull(d.System_Verification , 0) + d.Explained_Basics + d.Clean_Up + d.Refer_Tech + isnull(d.Issue_Resolution , 0)) / 
(case when d.WorkOrderType in ('TC' , 'SC') then 6.0 else 7.0 end ) , 2)) /  count(d.WONumber) , 2)
from tbl_DishCustomerSurveyData d 
where CallDate = '07/01/2015'


select * from @csat