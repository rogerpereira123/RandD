select tc12.* from tbl_TC12
tc12
inner join tbl_Data_Job_Setup tjs on tc12.OrgWONumber = tjs.WONumber
where
tjs.TechCode = '4591'

and
tjs.CSGLastChangedDate >= '04/28/2010'
and
tjs.CSGLastChangedDate <='06/22/2010'