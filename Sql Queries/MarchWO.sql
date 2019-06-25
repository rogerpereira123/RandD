
drop table #can
select * from tbl_30_day where work_order_number in (select [work order number] from #can)









select [work order number],[work order type], [customer name] ,[csg acct number],[CUSTOMER ADDRESS], [csg status],[WO create date], [CSG LAST CHANGED DATE]--,isnull(#tmp.reviewnote,'')  
into #Can
from marchwo
left outer join #tmp on [work order number] = #tmp.wonumber
where
[csg status] = 'X'
and
[WO create date] = [CSG LAST CHANGED DATE]
and
(
([work order type] in ('NC', 'RC', 'RS'))
or
(
[SERVICE CODES] like '%{Y%'
or
[SERVICE CODES] like '%}J%'
or
[SERVICE CODES] like '%}K%'
or
[SERVICE CODES] like '%}L%'
or
[SERVICE CODES] like '%}M%'
or
[SERVICE CODES] like '%4Z%'
or
[SERVICE CODES] like '%P$%'
or
[SERVICE CODES] like '%Q-%'
or
[SERVICE CODES] like '%Q;%'
or
[SERVICE CODES] like '%Q!%'
or
[SERVICE CODES] like '%Q/%'
or
[SERVICE CODES] like '%ECL%'
or
[SERVICE CODES] like '%X(%'
or
[SERVICE CODES] like '%X<%'
)

)


union
select [work order number],[work order type], [customer name] , [csg acct number],[CUSTOMER ADDRESS],[csg status],[WO create date], [CSG LAST CHANGED DATE],'' from marchwo
where 
[csg status] = 'C'
and
[csg acct number] in
(
select [csg acct number] from marchwo
where 
[csg status] = 'X'
and
(
([work order type] in ('NC', 'RC', 'RS'))
or
(
[SERVICE CODES] like '%{Y%'
or
[SERVICE CODES] like '%}J%'
or
[SERVICE CODES] like '%}K%'
or
[SERVICE CODES] like '%}L%'
or
[SERVICE CODES] like '%}M%'
or
[SERVICE CODES] like '%4Z%'
or
[SERVICE CODES] like '%P$%'
or
[SERVICE CODES] like '%Q-%'
or
[SERVICE CODES] like '%Q;%'
or
[SERVICE CODES] like '%Q!%'
or
[SERVICE CODES] like '%Q/%'
or
[SERVICE CODES] like '%ECL%'
or
[SERVICE CODES] like '%X(%'
or
[SERVICE CODES] like '%X<%'
)

)

)
and 
([work order type] in ('NC', 'RC', 'RS')
or

[SERVICE CODES] like '%{Y%'
or
[SERVICE CODES] like '%}J%'
or
[SERVICE CODES] like '%}K%'
or
[SERVICE CODES] like '%}L%'
or
[SERVICE CODES] like '%}M%'
or
[SERVICE CODES] like '%4Z%'
or
[SERVICE CODES] like '%P$%'
or
[SERVICE CODES] like '%Q-%'
or
[SERVICE CODES] like '%Q;%'
or
[SERVICE CODES] like '%Q!%'
or
[SERVICE CODES] like '%Q/%'
or
[SERVICE CODES] like '%ECL%'
or
[SERVICE CODES] like '%X(%'
or
[SERVICE CODES] like '%X<%'
)

order by [customer name]




