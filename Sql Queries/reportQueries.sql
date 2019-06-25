
select saledate ,count(*) as 'NC' into #NC from tbl_data_job_setup group by saledate,workordertype having workordertype = 'NC' and saledate >= '12/01/2006' and saledate <= '12/21/2006'
select saledate ,count(*) as 'TC' into #TC from tbl_data_job_setup group by saledate,workordertype having workordertype = 'TC' and saledate >= '12/01/2006' and saledate <= '12/21/2006'
select saledate ,count(*) as 'SC' into #SC from tbl_data_job_setup group by saledate,workordertype having workordertype = 'SC' and saledate >= '12/01/2006' and saledate <= '12/21/2006'
select saledate ,count(*) as 'CH' into #CH from tbl_data_job_setup group by saledate,workordertype having workordertype = 'CH' and saledate >= '12/01/2006' and saledate <= '12/21/2006'
select saledate ,count(*) as 'RC' into #RC from tbl_data_job_setup group by saledate,workordertype having workordertype = 'RC' and saledate >= '12/01/2006' and saledate <= '12/21/2006'

select saledate , count(*) as Total into #TOTAL from tbl_data_job_setup group by saledate having saledate >= '12/01/2006' and saledate <= '12/21/2006'

select #TOTAL.saledate,TC,SC,NC,RC,CH,Total from #TC,#SC,#NC,#RC,#CH,#TOTAL where 
#TOTAL.saledate = #TC.saledate and 
#TOTAL.saledate = #SC.saledate and  
#TOTAL.saledate = #NC.saledate and  
#TOTAL.saledate = #RC.saledate and  
#TOTAL.saledate = #CH.saledate 


select saledate,count(*) as 'NC' into #CNC from tbl_data_job_setup where csglastchangeddate = saledate and csgstatus = 'x' group by saledate,workordertype having workordertype = 'NC' and saledate >= '12/01/2006' and saledate <= '12/21/2006'
select saledate,count(*) as 'TC' into #CTC from tbl_data_job_setup where csglastchangeddate = saledate and csgstatus = 'x' group by saledate,workordertype having workordertype = 'TC' and saledate >= '12/01/2006' and saledate <= '12/21/2006' 
select saledate,count(*) as 'SC' into #CSC from tbl_data_job_setup where csglastchangeddate = saledate and csgstatus = 'x' group by saledate,workordertype having workordertype = 'SC' and saledate >= '12/01/2006' and saledate <= '12/21/2006'
select saledate,count(*) as 'CH' into #CCH from tbl_data_job_setup where csglastchangeddate = saledate and csgstatus = 'x' group by saledate,workordertype having workordertype = 'CH' and saledate >= '12/01/2006' and saledate <= '12/21/2006'
select saledate,count(*) as 'RC' into #CRC from tbl_data_job_setup where csglastchangeddate = saledate and csgstatus = 'x' group by saledate,workordertype having workordertype = 'RC' and saledate >= '12/01/2006' and saledate <= '12/21/2006'

select saledate,count(*) as 'Total' into #CTOTAL from tbl_data_job_setup where csglastchangeddate = saledate and csgstatus = 'x' group by saledate having saledate >= '12/01/2006' and saledate <= '12/21/2006'

select #CTOTAL.saledate,TC,SC,NC,RC,CH,Total from #CTC,#CSC,#CNC,#CRC,#CCH,#CTOTAL where 
#CTOTAL.saledate = #CTC.saledate and 
#CTOTAL.saledate = #CSC.saledate and  
#CTOTAL.saledate = #CNC.saledate and  
#CTOTAL.saledate = #CRC.saledate and  
#CTOTAL.saledate = #CCH.saledate 



drop table #NC
drop table #TC
drop table #SC
drop table  #CH
drop table #RC
drop table #TOTAL

drop table #CNC
drop table #CTC
drop table #CSC
drop table #CCH
drop table #CRC
drop table #CTOTAL
