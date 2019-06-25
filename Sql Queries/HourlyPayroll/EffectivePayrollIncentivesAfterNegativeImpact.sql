select sum(
case when  (Week1PointsIncentives + Week1TC12Component + Week1TC30Component +  Week1CSATComponent + Week1ConnectivityComponent ) < 0 then 0 
else (Week1PointsIncentives + Week1TC12Component + Week1TC30Component +  Week1CSATComponent + Week1ConnectivityComponent )
end
+
case when  (Week2PointsIncentives + Week2TC12Component + Week2TC30Component +  Week2CSATComponent + Week2ConnectivityComponent ) < 0 then 0 
else (Week2PointsIncentives + Week2TC12Component + Week2TC30Component +  Week2CSATComponent + Week2ConnectivityComponent )
end

) as TotalEffectiveIncentivesPaidOut ,
SUM(
case when  (Week1PointsIncentives + Week1TC12Component + Week1TC30Component +  Week1CSATComponent + Week1ConnectivityComponent ) < 0 then 0
else 
Week1PointsIncentives end
+
case when (Week2PointsIncentives + Week2TC12Component + Week2TC30Component +  Week2CSATComponent + Week2ConnectivityComponent ) < 0 then 0 else Week2PointsIncentives end
) as EffectivePointsIncentives,
SUM(
case when  (Week1PointsIncentives + Week1TC12Component + Week1TC30Component +  Week1CSATComponent + Week1ConnectivityComponent ) <= 0 then 0 
else Week1TC12Component end
+
case when (Week2PointsIncentives + Week2TC12Component + Week2TC30Component +  Week2CSATComponent + Week2ConnectivityComponent ) < 0 then 0 else Week2TC12Component end
) as EffectiveTC12Incentives,
SUM(
case when  (Week1PointsIncentives + Week1TC12Component + Week1TC30Component +  Week1CSATComponent + Week1ConnectivityComponent ) <= 0 then 0 
else Week1TC30Component end
+
case when (Week2PointsIncentives + Week2TC12Component + Week2TC30Component +  Week2CSATComponent + Week2ConnectivityComponent ) < 0 then 0 else Week2TC30Component end
) as EffectiveTC30Incentives,
SUM(
case when  (Week1PointsIncentives + Week1TC12Component + Week1TC30Component +  Week1CSATComponent + Week1ConnectivityComponent ) <= 0 then 0 
else Week1CSATComponent end
+
case when (Week2PointsIncentives + Week2TC12Component + Week2TC30Component +  Week2CSATComponent + Week2ConnectivityComponent ) < 0 then 0 else Week2CSATComponent end
) as EffectiveCSATIncentives,
SUM(
case when  (Week1PointsIncentives + Week1TC12Component + Week1TC30Component +  Week1CSATComponent + Week1ConnectivityComponent ) <= 0 then 0 
else Week1ConnectivityComponent end
+
case when (Week2PointsIncentives + Week2TC12Component + Week2TC30Component +  Week2CSATComponent + Week2ConnectivityComponent ) < 0 then 0 else Week2ConnectivityComponent end
) as EffectiveConnectivityIncentives
from tbl_TechPayrollDetails tpd 

where tpd.PayrollStartDate = '08/14/2013'


