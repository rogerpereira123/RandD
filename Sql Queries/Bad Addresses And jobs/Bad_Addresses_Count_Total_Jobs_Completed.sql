
select 
tts.TechCode,  tts.TechName, count(b.Address_Id) as 'No. Of Bad Adresses' 
from 
Bad_addresses b 
inner join tbl_ZipToSupervisor zip on b.[zip code] = zip.zipcode
inner join tbl_TechToLocation ttl on zip.supervisor = ttl.TechCode
inner join tbl_TechToSupervisor tts on tts.TechCode = zip.Supervisor
--inner join tbl_Location l on ttl.Location_id = l.Location_Id
group by tts.TechCode ,tts.TechName --, l.Location



	select tts.TechCode, tts.TechName , 
	case 
	when month(convert(datetime ,tjs.CSGLastChangedDate , 101))= 12 then 'DEC'
	when month(convert(datetime ,tjs.CSGLastChangedDate , 101)) = 1 then 'JAN' 
	when month(convert(datetime ,tjs.CSGLastChangedDate , 101)) = 2 then 'FEB'
	end as monthName ,count(tjs.WONumber) 
  
	from tbl_data_job_setup tjs
	inner join tbl_ziptosupervisor tzs on tjs.Customerzip = tzs.ZipCode
	inner join tbl_TechToLocation ttl on tzs.supervisor = ttl.TechCode
	inner join tbl_TechToSupervisor tts on tts.TechCode = tzs.Supervisor
	where
	tjs.CSGStatus in ('C' , 'D')
	and
	tjs.CSGLastChangedDate >= '02/01/2008'
	and
	tjs.CSGLastChangedDate <= '02/29/2008'
	group by tts.TechCode, tts.TechName , month(convert(datetime ,tjs.CSGLastChangedDate , 101))
	order by tts.TechCode , monthName




select tts.TechCode, tts.TechName ,
case 
	when month(convert(datetime ,tjs.LastUpdatedDt , 101))= 12 then 'DEC'
	when month(convert(datetime ,tjs.LastUpdatedDt , 101)) = 1 then 'JAN' 
	when month(convert(datetime ,tjs.LastUpdatedDt , 101)) = 2 then 'FEB'
	end as monthName , count(tjs.WONumber)
from internalworkorder tjs
inner join tbl_data_customers tdc on tjs.CustomerId = tdc.CustomerId
inner join tbl_ziptosupervisor tzs on tdc.zipcode = tzs.ZipCode
inner join tbl_TechToLocation ttl on tzs.supervisor = ttl.TechCode
inner join tbl_TechToSupervisor tts on tts.TechCode = tzs.Supervisor
where
tjs.Status in ('C' , 'D')
and
tjs.LastUpdatedDt >= '02/01/2008'
and
tjs.LastUpdatedDt <= '02/29/2008'
group by tts.TechCode, tts.TechName, month(convert(datetime ,tjs.LastUpdatedDt , 101))
order by tts.TechCode, monthName


