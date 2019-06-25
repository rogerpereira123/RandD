use DBRecipes;
--1. How many ingredients are in “Kitchen Sink Cookies”?
select 
count(ri.Id) as NumberOfIngredients
from 
Recipe r inner join RecipeIngredients ri on r.Id = ri.RecipeId
where r.Title = 'Kitchen Sink Cookies'

--2. What are the names of the three most used ingredients by quantity in all recipes authored by Cara?
select 
d.Name as ThreeMostUsedIngredientsByQuantity
from 
(select 
distinct top 3 i.Name , (ri.QtyNumerator * 1.0  / ri.QtyDenominator)  as Qty
from 
Recipe r 
inner join RecipeIngredients ri on r.Id = ri.RecipeId
inner join Ingredients i on i.Id = ri.IngredientId
where r.SubmittedBy = 'Cara'
order by (ri.QtyNumerator * 1.0  / ri.QtyDenominator) desc) d 

--3. What is the name of all recipes that do not use egg as an ingredient?
select
nonEggRecipes.Title
from Recipe nonEggRecipes 
left join 
(select r.Id from Recipe r 
inner join RecipeIngredients ri on r.Id = ri.RecipeId 
inner join Ingredients i on ri.IngredientId = i.Id
where i.Name = 'Egg') as eggRecipes on nonEggRecipes.Id = eggRecipes.Id
where eggRecipes.Id is null

--4. List all ingredient names in the database sorted by name. Exclude duplicates
select Name as Ingredient from Ingredients order by Name

--5. What are the directions, in order of the steps, for “No Bake Cookies II”?
select
d.DirectionId as Steps, d.Direction as Directions
from Recipe r 
inner join Directions d on r.Id = d.RecipeId
where r.Title = 'No Bake Cookies II'
order by d.DirectionId 

--6. What is the second word of each recipe title?
select
SUBSTRING(r.Title , charindex(' ' , r.Title , 1) + 1, charindex( ' ',r.Title , charindex(' ' , r.Title , 1) + 1) - charindex(' ' , r.Title , 1)) as SecondWordOFeachRecipeTitle
from Recipe r
