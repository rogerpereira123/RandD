select 
            tdc.[NAME],
            tdc.[PHONE],
            tdc.[ACCOUNTNO],
            tjs.[WONumber],
            tjs.[MGTArea],
            tjs.[TechCode],
            tjs.[WorkUnits],
            tjs.[ScheduledDate],
            tdc.[ADDRESS],
            tdc.[CITY],
            tdc.[STATE],
            tdc.[ZIPCODE],
            tdc.[DATEADDED],
            tdc.[NOTES],
            tdc.[PHONE2],
            tdc.[VER],
            tdc.[Active],
            tdc.[oldmatchtojob],
            tdc.[oldrecordno],
            tdc.[County],
            tjs.[ServiceCodes],
            tjs.[Hardware],
            tjs.[JobType],
            tjs.[TOD],
            tjs.[Branch],
            tjs.[SoldBy],
            tjs.[SaleDate],
            tjs.[JobStatus],
            tjs.[FIRSTCODE],
            tjs.[REASON1],
            tjs.[REASON2],
            tjs.[REASON3],
            tjs.[REASON4],
            tjs.[CustomerZip],
            tjs.[Importedate],
            tjs.[Processed],
            tjs.[OriginalSchDate],
            tjs.[EmployeeID],
            tjs.[Previousinstaller],
            tjs.[matchtojobno],
            tjs.[Problem],
            tjs.[oldjobno],
            tjs.[branchid],
            tjs.[WorkorderType],
            tjs.[Precalled],
            tjs.[InstallDate],
            tjs.[Postcalled],
            tjs.[hold1],
            tjs.[Materiallock],
            tjs.[serviceID],
            tjs.[Dateentered],
            tjs.[AssignedBy],
            tjs.[Category],
            tjs.[WorkOrderStatus],
            tjs.[CSGStatus],
            tjs.[CSGLastChangedDate],
            tjs.[Segment_Output]

             from
             tbl_PeriodicSnapshot PS
             inner join tbl_data_job_setup tjs on PS.JObId = tjs.JObId
             inner join tbl_data_customers tdc on tjs.customerid = tdc.customerid
             where
             convert(varchar(10),PS.Date,101) = '11/02/2007'
             and
             substring(convert(varchar(10),PS.Date,108) , 0 , 6) = '07:00'
             and
             PS.CsgStatus in ('O' , 'R')
             and
             tjs.segment_output in ('SBC' , 'SBCA' , 'ATT')
             and
             (tjs.CSGStatus in ('H' , 'R' , 'X')
             or
             tjs.WorkOrderStatus like '%hold%')
