select tdc.Name , iwo.LastUpdateddt , iwo.createdlogin  from 
internalworkorder iwo 
inner join tbl_data_customers tdc on iwo.CustomerId = tdc.CustomerId
where
iwo.WorkOrderType = 'IS'
and
iwo.LastupdatedDt >= '04/13/2008'
and
iwo.LastupdatedDt <= '04/26/2008'
and
iwo.Status in ('C' , 'D')
and
iwo.createdlogin like '%jen%'