SELECT   
	tjs.WONumber AS WONumber,  
 	tjs.CSGLastChangedDate AS ClosedDate,
	tjs.WorkorderType AS WOType,
 	tjs.CustomerZip AS ZipCode,	
	case when p.LoginTime is null then '' else CONVERT(varchar(30) ,p.LoginTime,100) end  AS PostcallTime,  
 	isnull(p.LoginID,'') AS Postcaller,  
 	ISNULL(ps.Status_Desc,'Not Postcalled') AS Status,  
		
 
case when tjs.csgstatus='O' then 'OPEN'
	when tjs.csgstatus='R' then 'RESCHEDULED'
	when tjs.csgstatus='X' then 'CANCELLED'
	when tjs.csgstatus='C' then 'COMPLETE'
	when tjs.csgstatus='H' then 'HOLD'
	when tjs.csgstatus='D' then 'D-UNKNOWN'
	else tjs.csgstatus end as CSGStatus
	
 	FROM tbl_Data_Job_Setup tjs       
 	LEFT JOIN tbl_Data_PostCall p  ON tjs.WONumber=p.WONumber
 	LEFT JOIN tbl_PostcallStatus AS ps ON p.Status_ID=ps.Status_Id
 	left join tbl_PostcallWoToIssue pti on p.WONumber = pti.WoNumber
 	left join tbl_PostcallIssues issues on pti.IssueId = issues.IssueId
WHERE      
 	tjs.CSGLastChangedDate >= '03/18/2013'
 	and tjs.CSGLastChangedDate <= '03/21/2013' 
 	and tjs.CSGStatus = 'C'
 	ORDER BY tjs.importedate DESC   
 	