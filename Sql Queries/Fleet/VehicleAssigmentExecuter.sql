declare @Status varchar(2000) = ''
exec usp_Fleet_insUpdateVehiclePossessionV1 97,5161108 , '03/29/2014 07:00' , '03/30/2014 11:00' ,'rogerp', @Status out
select @Status