--update tbl_InvTxnLine set ProductId = '121670' where InvTxnLineId in
select * from tbl_InvTxnLine where InvTxnLineId in
(select InvTxnLineId from tbl_InvTxnUnit where SerialNo1 like 'DPPTC%')
and
ProductId <> '121670'

select * from tbl_InvTxnUnit where InvTxnLineId = 'B221800NL01'
B220503AL06

B220503AL06
I21280DTL02
N2205022L06
N2205038L06

select * from tbl_InvTxnUnit where SerialNo1 = 'DPPTC43230'
select * from tbl_InvTxnline where InvTxnLineId = 'B221800NL01'
select * from tbl_InvTxn where DocNo like '%SW%'
select * from tbl_InvTxn where InvTxnId = 'B221800N'
select * from tbl_InvTxnOut2InUnit
where
InvTxnunitId = 'I21280DTU02'

select * from tbl_InvTxnIn2OutUnit
where
InvTxnunitId = 'I21280DTU02'



drop table #problem

select unit.InvtxnLineId, substring(unit.SerialNo1 , 1 ,4) as sr into #problem from 
tbl_InvTxnLine line inner join tbl_InvTxnUnit unit on line.InvTxnLineId = unit.InvTxnLineId
where
convert(varchar(3000),line.Narration) = 'Received From Southware'
and
unit.SerialNo2 is null
and
unit.SerialNo3 is null
group by unit.InvtxnLineId , substring(unit.SerialNo1 , 1 ,4)
having 
count(unit.InvTxnLineId) > 1
order by unit.InvTxnLineId



select InvTxnLineId from tbl_InvTxnUnit where InvTxnLineId in (
select InvtxnLineId from #problem group by InvtxnLineId having count(InvTxnLineId) > 1 )
and
SerialNo1 not like 'UNIV%'
and 
SerialNo1 not like 'U%'
and
SerialNo1 not like '1037%'
and
SerialNo1 not like '0129%'
group by InvTxnLineId having count(InvTxnLineId) > 1