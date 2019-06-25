declare @Transaction as tvp_InvTransaction
declare @Products as tvp_InvProduct


insert into @Transaction 
select 4293242 , 4331750 , 34 , 'rogerp', '' , 'DD000000000125986'

insert into @Products
select '107107' , 1 , '' , ''

insert into @Products
select '185647' , 1 , 'RREXBX45099K' , ''


exec usp_Inv_CreateTransaction @Transaction, @Products




