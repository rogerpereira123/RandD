declare @datetime_StartDate as datetime                                                                                  
declare @datetime_EndDate as datetime  
set @datetime_StartDate = '01/01/2008'
set @datetime_EndDate = '12/31/2008'
---For Labor                                        
                  
Create Table #OldLaborServiceCode                  
(                  
 WoNumber varchar(20),                  
 ServiceCode varchar(10),                  
 ClosedDate varchar(20),                  
 TotalAmount float                  
)                                     
                       
select TJS.WoNumber, TJS.servicecodes,convert(varchar(10),TJS.CSGLastChangedDate,101) as ClosedDate                                    
into #closedworkordersLabor                                         
from tbl_data_job_setup TJS   
inner join tbl_data_customers tdc on tjs.customerid = tdc.Customerid                                     
where TJS.CSGStatus in ('C' , 'D') and                                                  
TJS.CSGLastChangedDate between @datetime_StartDate and @datetime_EndDate                     
and
tdc.State = 'IN'

                    
update #closedworkordersLabor set servicecodes=substring(servicecodes,0,charindex('7P',servicecodes)+1)+                    
Replace(substring(servicecodes,charindex('7P',servicecodes)+1,len(servicecodes)),'7P','')                      
                    
update #closedworkordersLabor set servicecodes=substring(servicecodes,0,charindex('4W',servicecodes)+1)+                    
Replace(substring(servicecodes,charindex('4W',servicecodes)+1,len(servicecodes)),'4W','')                     
                    
update #closedworkordersLabor set servicecodes = replace(servicecodes,'P2','') where charindex('–K',ServiceCOdes) > 0                  
or  charindex('9Z',ServiceCOdes) > 0 or  charindex('J{',ServiceCOdes) > 0 or  charindex('8!',ServiceCOdes) > 0                 
or  charindex('7P',ServiceCOdes) > 0 or charindex('}P',ServiceCOdes) > 0  or charindex('7Q',ServiceCOdes) > 0                                   
update #closedworkordersLabor set servicecodes = replace(servicecodes,'HY','') where charindex('J{',ServiceCOdes) > 0                     
update #closedworkordersLabor set servicecodes = replace(servicecodes,'T4','') where charindex('OT',ServiceCOdes) > 0                     
update #closedworkordersLabor set servicecodes = replace(servicecodes,'7P','') where charindex('7Q',ServiceCOdes) > 0                     
update #closedworkordersLabor set servicecodes = replace(servicecodes,'8!','') where charindex('9Z',ServiceCOdes) > 0               
update #closedworkordersLabor set servicecodes = replace(servicecodes,'{W','') where charindex('{}',ServiceCOdes) > 0                     
update #closedworkordersLabor set servicecodes = replace(servicecodes,'||','|')                    
                            
select distinct TE.WoNumber,TE.ServiceCode,cw.ClosedDate, TE.ReimAmount as TotalAmount                                        
into #nl          
from tbl_ExpectedWOLaborPayment TE                                        
inner join #closedworkordersLabor cw on TE.WoNumber = cw.WoNumber            
where charindex(TE.ServiceCode,cw.ServiceCodes,1) > 0      -- Added by Kiran on 06 dec 2008 for Paid ServiceCode of Rule                            
          
select WoNumber,ClosedDate, TotalAmount into #newlabor from #nl          
          
drop table #nl                            
                                        
select cw.WoNumber,cw.servicecodes,cw.ClosedDate                                        
into #oldclosedworkorders                                        
from #closedworkordersLabor cw                                        
left join #newlabor nl on cw.WoNumber = nl.WoNumber                                        
where nl.WoNumber is null                                        
                                        
if (@datetime_StartDate < convert(datetime,'07/01/2008' , 101) and @datetime_EndDate < convert(datetime,'07/01/2008',101))                  
begin                  
                
insert into #OldLaborServiceCode                         
select ocw.WoNumber,stp.ServiceCode ,ocw.ClosedDate,max(stp.LaborReimAmount) as TotalAmount                        
from tbl_ServiceCodeToTaskPayment_BeforeJuly as stp , #oldclosedworkorders  as ocw                                                                           
where                                                                                                                                                     
CHARINDEX  (stp.ServiceCode, ocw.ServiceCodes,1) > 0                                        
group by ocw.WoNumber,stp.ServiceCode, ocw.ClosedDate                    
end                  
                  
else                    
                
begin                  
insert into #OldLaborServiceCode                         
select ocw.WoNumber,stp.ServiceCode ,ocw.ClosedDate,max(stp.LaborReimAmount) as TotalAmount                        
from tbl_ServiceCodeToTaskPayment as stp , #oldclosedworkorders  as ocw                                                                           
where                                                                                                                                                     
CHARINDEX  (stp.ServiceCode, ocw.ServiceCodes,1) > 0                                        
group by ocw.WoNumber,stp.ServiceCode, ocw.ClosedDate                    
                  
end                                
                                        
select  olsc.WoNumber,olsc.ClosedDate, sum(olsc.TotalAmount) as TotalAmount                                        
into #oldlabor                                         
from #OldLaborServiceCode olsc                                        
group by olsc.WoNumber,olsc.ClosedDate                                        
                                        
select * into #Labor from #newlabor                                         
insert into #Labor select * from #oldlabor                                        
                                        
select ClosedDate,sum(TotalAmount) as TotalAmount from #Labor                                         
group by ClosedDate                                        
order by ClosedDate                                        
                                        
---For Equipment                                        
                              
select TJS.WoNumber, TJS.servicecodes,convert(varchar(10),TJS.CSGLastChangedDate,101) as ClosedDate             
,ITL.ProductId,TJS.WorkOrderType   into #closedworkordersEquipment                                         
from tbl_data_job_setup TJS left join tbl_wo2invtxn wo2 on TJS.wonumber =  wo2.wonumber                      
left join tbl_invtxn IT on wo2.Invtxnid = IT.Invtxnid                                    
left join tbl_invtxnLine ITL on IT.Invtxnid = ITL.Invtxnid                                           
inner join tbl_data_customers tdc on tjs.Customerid = tdc.CustomerId
where TJS.CSGStatus = 'C' and                                                  
TJS.CSGLastChangedDate between @datetime_StartDate and @datetime_EndDate                         
and
tdc.State = 'IN'
                    
update #closedworkordersEquipment set servicecodes=substring(servicecodes,0,charindex('7P',servicecodes)+1)+                    
Replace(substring(servicecodes,charindex('7P',servicecodes)+1,len(servicecodes)),'7P','')                      
                    
update #closedworkordersEquipment set servicecodes=substring(servicecodes,0,charindex('4W',servicecodes)+1)+                    
Replace(substring(servicecodes,charindex('4W',servicecodes)+1,len(servicecodes)),'4W','')                    
                    
update #closedworkordersEquipment set servicecodes = replace(servicecodes,'P2','') where charindex('–K',ServiceCOdes) > 0                  
or  charindex('9Z',ServiceCOdes) > 0 or  charindex('J{',ServiceCOdes) > 0 or  charindex('8!',ServiceCOdes) > 0                 
or  charindex('7P',ServiceCOdes) > 0 or charindex('}P',ServiceCOdes) > 0  or charindex('7Q',ServiceCOdes) > 0                                   
update #closedworkordersEquipment set servicecodes = replace(servicecodes,'HY','') where charindex('J{',ServiceCOdes) > 0                     
update #closedworkordersEquipment set servicecodes = replace(servicecodes,'T4','') where charindex('OT',ServiceCOdes) > 0                     
update #closedworkordersEquipment set servicecodes = replace(servicecodes,'7P','') where charindex('7Q',ServiceCOdes) > 0                     
update #closedworkordersEquipment set servicecodes = replace(servicecodes,'8!','') where charindex('9Z',ServiceCOdes) > 0                     
update #closedworkordersEquipment set servicecodes = replace(servicecodes,'{W','') where charindex('{}',ServiceCOdes) > 0                     
update #closedworkordersEquipment set servicecodes = replace(servicecodes,'||','|')                    
                              
select distinct TE.WoNumber,cw.ClosedDate,TE.ServiceCode, TE.ReimAmount as TotalAmount,cw.WorkOrderType                            
into #newEquipment                                        
from tbl_ExpectedWOEquipmentPayment TE                                        
inner join #closedworkordersEquipment cw on TE.WoNumber = cw.WoNumber and TE.StockNumber = CW.ProductId                            
where charindex(TE.ServiceCode,cw.ServiceCodes,1) > 0    -- Added by Kiran on 06 dec 2008 for Paid ServiceCode of Rule                            
    
-- Added by Kiran on 06 Dec 2008 For VIP Item **** START ****--    
insert into #newEquipment     
select distinct cw.WoNumber,Cw.Closeddate,'||',P.ReimAmount,cw.WorkOrderType                                  
from #closedworkordersEquipment cw inner join tbl_ReconAdditionalExpectations p    
on cw.productid= p.stockno where cw.Closeddate>=p.EffectiveDate and     
CharIndex(cw.WorkOrderType,p.ApplicableWoTypes,1)>0    
-- Added by Kiran on 06 Dec 2008 For VIP Item **** END ****--    
                          
insert into #newEquipment                            
select TE.WoNumber,cw.ClosedDate,TE.ServiceCode , min(TE.ReimAmount) as TotalAmount,cw.WorkOrderType                          
from tbl_ExpectedWOEquipmentPayment TE                                    
inner join #closedworkordersEquipment cw on TE.WoNumber = cw.WoNumber                            
left join #newEquipment ne on cw.WONumber = ne.WONumber and TE.ServiceCode = ne.ServiceCode                            
where ne.ServiceCode is null                               
group by TE.WoNumber,cw.ClosedDate, TE.ServiceCode,cw.WorkOrderType    
                                       
select cw.WoNumber,cw.servicecodes,cw.ClosedDate, cw.ProductId,cw.WorkOrderType                                            
into #oldclosedworkordersEquipment                                        
from #closedworkordersEquipment cw                                        
left join #newEquipment ne on cw.WoNumber = ne.WoNumber                                        
where ne.WoNumber is null                                        
                                    
select ocwe.WoNumber,rscg.ServiceCode ,ocwe.ClosedDate,rscg.EquipmentReimAmount as TotalAmount,ocwe.ProductId                                     
,ocwe.WorkOrderType into #OldEquipmentServiceCode                              
from tbl_ReconServiceCodeGrid as rscg , #oldclosedworkordersEquipment  as ocwe                                            
where                                                                                                                                                     
CHARINDEX  (rscg.ServiceCode, ocwe.ServiceCodes,1) > 0                                     
and  ocwe.ProductId = rscg.StockNo                                      
group by ocwe.WoNumber,rscg.ServiceCode, ocwe.ClosedDate,rscg.EquipmentReimAmount,ocwe.ProductId,ocwe.WorkOrderType                                      
                                    
                              
                                
insert into #OldEquipmentServiceCode                                
select ocwe.WoNumber,rscg.ServiceCode ,ocwe.ClosedDate,min(rscg.EquipmentReimAmount) as TotalAmount,ocwe.ProductId                                     
,ocwe.WorkOrderType from tbl_ReconServiceCodeGrid as rscg ,                                 
#oldclosedworkordersEquipment  as ocwe                                            
left join #OldEquipmentServiceCode oesc on ocwe.WoNumber = oesc.WoNumber                                
where                                
CHARINDEX  (rscg.ServiceCode, ocwe.ServiceCodes,1) > 0                                     
and                                
oesc.ServiceCode is null                                
group by ocwe.WoNumber,rscg.ServiceCode ,ocwe.ClosedDate,ocwe.ProductId,ocwe.WorkOrderType       
                                        
select  oesc.WoNumber,oesc.ClosedDate,oesc.ServiceCode as ServiceCode, sum(oesc.TotalAmount) as TotalAmount,oesc.WorkOrderType    
into #oldEquipment                                         
from #OldEquipmentServiceCode oesc                                        
group by oesc.WoNumber,oesc.ClosedDate,oesc.ServiceCode,oesc.WorkOrderType                                     
                                        
select * into #Equipment from #newEquipment                                         
insert into #Equipment select * from #oldEquipment                                        
                                        
select ClosedDate,sum(TotalAmount) as TotalAmount from #Equipment                                         
group by ClosedDate                                        
order by ClosedDate                                        
                                        
drop table #closedworkordersLabor                              
drop table #closedworkordersEquipment                                        
drop table #newlabor                                        
drop table #oldclosedworkorders                                        
drop table #OldLaborServiceCode                                        
drop table #oldlabor                                        
drop table #Labor                                        
drop table #newEquipment                                        
drop table #oldclosedworkordersEquipment                                        
drop table #OldEquipmentServiceCode                                        
drop table #oldEquipment                                        
drop table #Equipment        
                        