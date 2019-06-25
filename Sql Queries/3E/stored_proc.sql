use DBRecipes;
go

create procedure [sp_addUpateIngredient]

	@recipeId int,
	@ingredientId int,
	@quantityNumerator int,
	@quantityDenominator int,
	@additionalSpecifications varchar(200),
	@outputIngredients varchar(2000) output
as
begin
	
		
	--Validate input parameteres
	if(not exists(select * from Recipe where Id = @recipeId)) return -1;
	if(not exists(select * from Ingredients where Id = @ingredientId)) return -1;
	if(@quantityNumerator <= 0 or @quantityDenominator <= 0) return -1;

	--specific error condition
	if(exists(select * from Recipe r 
		inner join RecipeIngredients ri on r.Id = ri.RecipeId
		where r.Id = @recipeId and ri.IngredientId = @ingredientId 
		and ri.QtyNumerator = @quantityNumerator and ri.QtyDenominator = @quantityDenominator))
		return -1;

	if(exists(select ri.* from Recipe r 
		inner join RecipeIngredients ri on r.Id = ri.RecipeId
		where ri.IngredientId = @ingredientId and r.Id = @recipeId))
	begin
		update ri
		set 
		ri.QtyNumerator = @quantityNumerator,
		ri.QtyDenominator = @quantityDenominator
		from Recipe r 
		inner join RecipeIngredients ri on r.Id = ri.RecipeId
		where ri.IngredientId = @ingredientId and r.Id = @recipeId
	end
	else
	begin
		insert into RecipeIngredients (RecipeId , IngredientId , QtyNumerator , QtyDenominator , AdditionalSpecification )
		select @recipeId , @ingredientId , @quantityNumerator , @quantityDenominator , @additionalSpecifications
	end

	set @outputIngredients = ''

	select 
	@outputIngredients =  @outputIngredients + ';' + 
	(case 
		when ri.QtyNumerator = ri.QtyDenominator then '1'
		when ri.QtyDenominator = 1 then convert(varchar , ri.QtyNumerator) 
		when ri.QtyNumerator / ri.QtyDenominator > 0 then convert(varchar , (ri.QtyNumerator / ri.QtyDenominator)) + ' '+  convert(varchar , (ri.QtyNumerator % ri.QtyDenominator)) + '/' + convert(varchar , ri.QtyDenominator) 
		else convert(varchar , ri.QtyNumerator) + '/' + convert(varchar , ri.QtyDenominator) end
	) 
	+' ' + u.UOM + ' ' + i.Name
	from Recipe r 
	inner join RecipeIngredients ri on r.Id = ri.RecipeId
	inner join Ingredients i on ri.IngredientId = i.Id
	inner join UnitOfMeasurement u on i.UOMId = u.Id
	where r.Id = @recipeId
	
	set @outputIngredients = SUBSTRING(@outputIngredients , 2 , len(@outputIngredients));

	return 0;


end

/*
declare @recipeid int
declare @ingredientId int
declare @quantityNumerator int
declare @quantityDenominator int
declare @additionalSpecifications varchar(200)
declare @outputIngredients varchar(2000)
declare @rc int

set @recipeId = 1
set @ingredientId = 9
set @quantityNumerator = 7
set @quantityDenominator = 3
set @additionalSpecifications = ''

exec @RC = [dbo].[sp_addUpateIngredient] 
   @recipeId
  ,@ingredientId
  ,@quantityNumerator
  ,@quantityDenominator
  ,@additionalSpecifications
  ,@outputIngredients OUTPUT

select @rc as [Status] , @outputIngredients as Ingredients

*/