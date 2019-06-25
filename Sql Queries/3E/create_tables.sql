use DBRecipes;

--Table UnitOfMeasurement 
--This table holds measurement units for the  recipes
create table UnitOfMeasurement 
(
	Id int identity primary key,
	UOM varchar(50) not null
)

--Table Ingredients
--This table holds master list of ingredients which will be used for recipes
create table Ingredients
(
	Id int identity primary key,
	UOMId int, 
	Name varchar(100) not null
	constraint fk_Ingredients_UOMId foreign key (UOMId) references UnitOfMeasurement(Id)
)
--Table Recipes
--This table holds master recipe records
create table Recipe
(
	Id int identity primary key,
	Title varchar(200) not null,
	SubmittedBy varchar(200) not null,
	Reference varchar(500)
)
--Table Directions
--This table holds directions for each recipe
create table Directions
(
	RecipeId int,
	DirectionId int,
	Direction text
	constraint pk_Directions_RecipeId_DirectionId primary key (RecipeId , DirectionId)
	constraint fk_Directions_RecipeId foreign key (RecipeId) references Recipe(Id)
)
--Table RecipeIngredients
--This table holds ingredients for each recipe with quantities and additional specification
create table RecipeIngredients
(
	Id int identity primary key,
	RecipeId int,
	IngredientId int,
	QtyNumerator int not null,
	QtyDenominator int not null,
	AdditionalSpecification varchar(200)
	constraint fk_RecipeIngredients_RecipeId foreign key(RecipeId) references Recipe(Id),
	constraint fk_RecipeIngredients_IngredientId foreign key(IngredientId) references Ingredients(Id),
	constraint chk_RecipeIngredients_Quantity check (QtyNumerator > 0 and QtyDenominator > 0) 
) 

