declare @v table (VechielID bigint)

insert into @v
select
VehicleId 
from tbl_Fleet_VehiclePossession 
where PossessionEndDate is not null
group by VehicleId , PossessorInvParticipantId having COUNT(VehicleId) > 1 

declare @VEhicleID bigint = 0

while (exists(select * from @v))
begin

set @VEhicleID = (select top 1 VechielID from @v)

declare @t table (
Row int,
VPId bigint,
PSD datetime,
PED datetime)

insert into @t
select ROW_NUMBER() OVER(ORDER BY DateAdded desc) as Row, VehiclePossesionId , PossessionStartDate , PossessionEndDate    from tbl_Fleet_VehiclePossession where VehicleId = @VEhicleID

declare @R int = 1
declare @VPIdDest bigint = 0
declare @VPIdSource bigint =0
declare @PED datetime
declare @PSD datetime
while(@R <= ((select COUNT(*) from @t) - 1))
begin
	select @VPIdSource = VPId, @PSD = PSD from @t where Row = @R 
	select @VPIdDest = VPId , @PED = PED from @t where Row = (@R + 1)
	
	
	update vp
	set vp.PossessionEndDate = @PSD
	--select vp.VehiclePossesionId , vp.PossessionEndDate , @PSD as NewPossesionEndDate
	from tbl_Fleet_VehiclePossession as vp 
	, @t t 
	where
	t.Row = (@R +1 )
	and
	vp.VehiclePossesionId = @VPIdDest
	
	
	
	set @R = @R + 1
	
end

delete from @v where VechielID = @VEhicleID
end