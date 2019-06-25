declare @v table (DeviceId varchar(50))

insert into @v
select
DeviceId 
from tbl_Mobility_InvParticipantToDevice 
where PossessionEndDate is not null
group by DeviceId , InvParticipantId having COUNT(DeviceId) > 1 
declare @DeviceId varchar(50) = ''

while (exists(select * from @v))
begin

set @DeviceId = (select top 1 DeviceId from @v)

declare @t table (
Row int,
IPTD bigint,
PSD datetime,
PED datetime)

insert into @t
select ROW_NUMBER() OVER(ORDER BY PossessionStartDate desc) as Row, InvParticipantToDeviceId , PossessionStartDate , PossessionEndDate    from tbl_Mobility_InvParticipantToDevice where DeviceId = @DeviceId

declare @R int = 1
declare @VPIdDest bigint = 0
declare @VPIdSource bigint =0
declare @PED datetime
declare @PSD datetime
while(@R <= ((select COUNT(*) from @t) - 1))
begin
	select @VPIdSource = IPTD, @PSD = PSD from @t where Row = @R 
	select @VPIdDest = IPTD , @PED = PED from @t where Row = (@R + 1)
	
	
	update vp
	set vp.PossessionEndDate = @PSD,
	vp.DateModified = @PSD
	--select vp.InvParticipantToDeviceId , vp.PossessionEndDate , @PSD as NewPossesionEndDate
	from tbl_Mobility_InvParticipantToDevice as vp 
	, @t t 
	where
	t.Row = (@R +1 )
	and
	vp.InvParticipantToDeviceId = @VPIdDest
	
	
	
	set @R = @R + 1
	
end

delete from @v where DeviceId = @DeviceId
end