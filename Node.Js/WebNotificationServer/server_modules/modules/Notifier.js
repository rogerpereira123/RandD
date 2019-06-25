define(['config/NotifierConfig'], function(NOTIFICATIONS){
    return {
        'Create' : function(req){
            var n = req.query.notification;
            if (!n || n == "") return n;
             n = parseInt(n);
             var notificationObject = { notification: n };
             //Notifcation Switch
             switch(n)
             {
                 case NOTIFICATIONS.NEW_INVENTORY_TRANSACTION:
                        notificationObject.receiver = req.query.receiver;    
                        break;
                 case NOTIFICATIONS.TECH_REASSIGNED:
                        notificationObject.oldtech = req.query.oldtech;
                        notificationObject.newtech = req.query.newtech;
                        break;
                 case NOTIFICATIONS.WORK_ORDER_STATE_CHANGED:
                        notificationObject.workordernumber = req.query.workordernumber;
                        break;
                case NOTIFICATIONS.TECH_DRIVING_TO_WAREHOUSE:
                        break;
                case NOTIFICATIONS.TECH_BROWSER_RELOAD:
                        break;
                case NOTIFICATIONS.CUSTOMER_INVENTORY_CHANGED:
                        notificationObject.techinvparticipantid = req.query.techinvparticipantid;
                        break;
                case NOTIFICATIONS.NEW_MESSAGE_POSTED:
                         notificationObject.warehouseid = req.query.warehouseid;
                         break;
                default:
                    notificationObject = req.query;
                        break;
            }
            
            delete notificationObject.auth_key;

             return notificationObject;

            }
        };
    });