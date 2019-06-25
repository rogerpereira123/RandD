declare @Scores table (Id int Identity ,Score float)
insert into @Scores values(3.50)
insert into @Scores values(3.65)
insert into @Scores values(4.00)
insert into @Scores values(3.85)
insert into @Scores values(4.00)
insert into @Scores values(3.65)

select
Dense_Rank() over( order by Score desc) as Rank,
Score
from 
@Scores order By Score desc 