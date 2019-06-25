--Write a SQL query to find all numbers that appear at least three times consecutively.

declare @Logs table (Id int identity , Num int)
insert into @Logs values(1)
insert into @Logs values(1)
insert into @Logs values(1)
insert into @Logs values(2)
insert into @Logs values(2)
insert into @Logs values(1)
insert into @Logs values(2)
insert into @Logs values(2)


			

select d.Num from 
(
	select ll.Num , count(ll.Appearance) as Appearance
	from (
			select
			r.Id as RId , l.Id as LId, r.Num , r.Id - l.Id as Appearance
			from @Logs l 
			inner join @Logs r on l.Num = r.Num
			where r.Id - l.Id = 1 ) ll 
									inner join ( 
												select
												r.Id as RId , l.Id as LId, r.Num , r.Id - l.Id as Appearance
												from @Logs l 
												inner join @Logs r on l.Num = r.Num
												where r.Id - l.Id = 1 ) rr on ll.Num = rr.Num
									where ll.RId - rr.RId = 1
									group by ll.Num ) 
d 
