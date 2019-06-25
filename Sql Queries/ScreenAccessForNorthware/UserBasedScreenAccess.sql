select s.ScreenName, s.ParentId , parent.ScreenName as ParentScreen, s.ScreenType ,s.FormName , std.DocType from 
tbl_UserToScreen uts 
inner join tbl_Screen s on uts.ScreenId = s.ScreenId
left join tbl_Screen parent on s.ParentId = parent.ScreenId
left join tbl_ScreenToDocType std on s.ScreenId = std.ScreenId
where uts.UserId = 'rogerp'
and
uts.Rights is not null
and s.Active = 1

union

select s.ScreenName, s.ParentId , parent.ScreenName as ParentScreen, s.ScreenType ,s.FormName, std.DocType from 
tbl_GroupToScreen gts
inner join tbl_GroupTOUser gtu on gts.GroupId = gtu.GroupId
inner join tbl_screen s on gts.ScreenId = s.ScreenId
left join tbl_Screen parent on s.ParentId = parent.ScreenId
left join tbl_ScreenToDocType std on s.ScreenId = std.ScreenId
where
gtu.UserId = 'rogerp'
and
gts.Rights is not null
and s.Active = 1