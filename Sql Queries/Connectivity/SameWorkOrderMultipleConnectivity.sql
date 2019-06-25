select WONumber , InsertDate,ConnectionMethod,ClosedDate into #ip from tbl_DishConnectivity where ConnectionMethod = 'IP'
select WONumber, InsertDate,ConnectionMethod,ClosedDate into #phone from tbl_DishConnectivity where ConnectionMethod = 'phone'

select 
distinct #ip.wonumber,#ip.ClosedDate
from 
#ip inner join #phone  on #ip.wonumber = #phone.WONumber
where
#ip.ConnectionMethod <> #phone.ConnectionMethod
/*and
#ip.InsertDate = #phone.InsertDate*/

order by #ip.ClosedDate desc


drop table #ip
drop table #phone


select * from tbl_DishConnectivity where WONumber = '45069467100105001'