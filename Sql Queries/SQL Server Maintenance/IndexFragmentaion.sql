USE Northware;
GO
SELECT a.index_id, b.name, t.name as TableName, avg_fragmentation_in_percent
FROM sys.dm_db_index_physical_stats (DB_ID(), OBJECT_ID(N'tbl_InvTxnOu22InUnit'),
     NULL, NULL, NULL) AS a
    JOIN sys.indexes AS b ON a.object_id = b.object_id AND a.index_id = b.index_id
    inner join sys.tables t on b.object_id = t.object_id
where
avg_fragmentation_in_percent > 30
order by avg_fragmentation_in_percent desc