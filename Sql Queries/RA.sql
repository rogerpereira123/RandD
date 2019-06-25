use northware
--select LastOfCAiD_Num from temp1 group by LastOfCAiD_Num having count(LastOfCAiD_Num) > 1
select ra.[Tracking Number] from 
tbl_ra ra 
inner join temp1 t on ra.[Tracking Number] = t.LastOfCAiD_Num
left outer join tbl_ra_status s on ra.status = s.status_code
left outer join tbl_fedexTracking f on ra.FedexId = f.FedexId

