use DBRecipes;
--Master list of units of measurements
insert into UnitOfMeasurement values('Each')
insert into UnitOfMeasurement values('Cup')
insert into UnitOfMeasurement values('Teaspoon')
insert into UnitOfMeasurement values('Tablespoon')

--Master list of ingredients

--Measured in cups
insert into Ingredients (UOMId , Name)
select Id, 'Butter' from UnitOfMeasurement where UOM = 'Cup'

insert into Ingredients (UOMId , Name)
select Id, 'Brown Sugar' from UnitOfMeasurement where UOM = 'Cup'

insert into Ingredients (UOMId , Name)
select Id, 'All Purpose Flour' from UnitOfMeasurement where UOM = 'Cup'

insert into Ingredients (UOMId , Name)
select Id, 'Rolled Oats' from UnitOfMeasurement where UOM = 'Cup'

insert into Ingredients (UOMId , Name)
select Id, 'Semisweet Chocolate Chips' from UnitOfMeasurement where UOM = 'Cup'

insert into Ingredients (UOMId , Name)
select Id, 'Vanilla Baking Chips' from UnitOfMeasurement where UOM = 'Cup'

insert into Ingredients (UOMId , Name)
select Id, 'Butterscotch Chips' from UnitOfMeasurement where UOM = 'Cup'

insert into Ingredients (UOMId , Name)
select Id, 'Pecans' from UnitOfMeasurement where UOM = 'Cup'

insert into Ingredients (UOMId , Name)
select Id, 'White Sugar' from UnitOfMeasurement where UOM = 'Cup'

insert into Ingredients (UOMId , Name)
select Id, 'Milk' from UnitOfMeasurement where UOM = 'Cup'

insert into Ingredients (UOMId , Name)
select Id, 'Quick Cooking Oats' from UnitOfMeasurement where UOM = 'Cup'

--Measured in teaspoons
insert into Ingredients (UOMId , Name)
select Id, 'Vanilla Extract' from UnitOfMeasurement where UOM = 'Teaspoon'

insert into Ingredients (UOMId , Name)
select Id, 'Baking Soda' from UnitOfMeasurement where UOM = 'Teaspoon'

insert into Ingredients (UOMId , Name)
select Id, 'Salt' from UnitOfMeasurement where UOM = 'Teaspoon'

--Measured in tablespoons
insert into Ingredients (UOMId , Name)
select Id, 'Cocoa Powder' from UnitOfMeasurement where UOM = 'Tablespoon'

--Measured each
insert into Ingredients (UOMId , Name)
select Id, 'Egg' from UnitOfMeasurement where UOM = 'Each'


--List of recipes
insert into Recipe(Title, SubmittedBy, reference) values( 'Kitchen Sink Cookies' , 'Cara' , 'allrecipes.com (http://allrecipes.com/Recipe/Kitchen-Sink-Cookies/Detail.aspx)')
insert into Recipe(Title, SubmittedBy, reference) values( 'No Bake Cookies II' , 'Sandy' , 'allrecipes.com (http://allrecipes.com/Recipe/No-Bake-Cookies-II/Detail.aspx)')

--Directions

--Kitchen Sink Cookies
insert into Directions (RecipeId , DirectionId , Direction) 
select Id , 1 , 'Preheat the oven to 375 degrees F (190 degrees C).'   from Recipe where Title = 'Kitchen Sink Cookies'

insert into Directions (RecipeId , DirectionId , Direction) 
select Id , 2 , 'In a large bowl, cream together the butter and brown sugar until smooth. Beat in the eggs one at a time, then stir in the vanilla. Combine the flour, baking soda and salt; stir into the creamed mixture. Mix in the oats, chocolate chips, vanilla chips, butterscotch chips and chopped pecans. Drop by tablespoonfuls onto ungreased cookie sheets. Cookies should be at least 2 inches apart.'   
from Recipe where Title = 'Kitchen Sink Cookies'

insert into Directions (RecipeId , DirectionId , Direction) 
select Id , 3 , 'Bake for 8 to 10 minutes in the preheated oven. Allow cookies to cool on baking sheet for 5 minutes before removing to a wire rack to cool completely'   from Recipe where Title = 'Kitchen Sink Cookies'

--No Bake Cookies II
insert into Directions (RecipeId , DirectionId , Direction) 
select Id , 1 , 'Mix together sugar, butter or margarine, and milk in a saucepan. Bring to a boil and boil for one minute, stirring constantly.'   from Recipe where Title = 'No Bake Cookies II'

insert into Directions (RecipeId , DirectionId , Direction) 
select Id , 2 , 'Remove from heat and mix in cocoa, quick oatmeal and vanilla. Drop by spoonfuls on waxed paper.'   from Recipe where Title = 'No Bake Cookies II'

--RecipeIngredients

--Kitchen Sink Cookies
insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 1 , 1 , 'Softened'  from Recipe r , Ingredients i where r.Title = 'Kitchen Sink Cookies' and i.Name = 'Butter'

insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 2 , 1 , 'Packed'  from Recipe r , Ingredients i where r.Title = 'Kitchen Sink Cookies' and i.Name = 'Brown Sugar'

insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 2 , 1 , ''  from Recipe r , Ingredients i where r.Title = 'Kitchen Sink Cookies' and i.Name = 'Egg'

insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 2 , 1 , ''  from Recipe r , Ingredients i where r.Title = 'Kitchen Sink Cookies' and i.Name = 'Vanilla extract'

insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 7 , 3 , ''  from Recipe r , Ingredients i where r.Title = 'Kitchen Sink Cookies' and i.Name = 'All purpose flour'

insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 1 , 1 , ''  from Recipe r , Ingredients i where r.Title = 'Kitchen Sink Cookies' and i.Name = 'Baking soda'

insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 1 , 1 , ''  from Recipe r , Ingredients i where r.Title = 'Kitchen Sink Cookies' and i.Name = 'Salt'

insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 2 , 1 , ''  from Recipe r , Ingredients i where r.Title = 'Kitchen Sink Cookies' and i.Name = 'Rolled Oats'

insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 1 , 1 , ''  from Recipe r , Ingredients i where r.Title = 'Kitchen Sink Cookies' and i.Name = 'Semisweet Chocolate chips'

insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 1 , 1 , ''  from Recipe r , Ingredients i where r.Title = 'Kitchen Sink Cookies' and i.Name = 'Vanilla baking chips'

insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 1 , 2 , ''  from Recipe r , Ingredients i where r.Title = 'Kitchen Sink Cookies' and i.Name = 'Butterscotch chips'

insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 1 , 1 , 'Chopped'  from Recipe r , Ingredients i where r.Title = 'Kitchen Sink Cookies' and i.Name = 'Pecans'

--No Bake Cookies II
insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 2 , 1 , ''  from Recipe r , Ingredients i where r.Title = 'No Bake Cookies II' and i.Name = 'White Sugar'

insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 1 , 2 , ''  from Recipe r , Ingredients i where r.Title = 'No Bake Cookies II' and i.Name = 'Butter'

insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 1 , 2 , ''  from Recipe r , Ingredients i where r.Title = 'No Bake Cookies II' and i.Name = 'Milk'

insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 3 , 1 , ''  from Recipe r , Ingredients i where r.Title = 'No Bake Cookies II' and i.Name = 'Cocoa Powder'

insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 3 , 1 , ''  from Recipe r , Ingredients i where r.Title = 'No Bake Cookies II' and i.Name = 'Quick Cooking Oats'

insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator ,  AdditionalSpecification) 
select r.Id , i.Id , 1 , 1 , ''  from Recipe r , Ingredients i where r.Title = 'No Bake Cookies II' and i.Name = 'Vanilla extract'








