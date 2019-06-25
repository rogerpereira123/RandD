select WoNumber , isnull(WOIssue, '') + '  '+isnull(SalesIssue, '') + isnull(SummarizedComments, '') , Createddate, SentBy from tbl_data_ModifiedStatus where CreatedDate >= '04/30/2008' and CreatedDate <= '05/06/2008'
union all
select WoNumber, Comment, Date, UserId from tbl_ModifiedWocomments where Date >= '04/30/2008' and Date <= '05/06/2008'