<%@ Page Language="C#" %>

<!DOCTYPE html>

<script runat="server">

</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
     <script type="text/javascript" src="jquery-1.9.0.min.js"></script>
    <script type="text/javascript" src="WebNotificationServerCommunicator.js"></script>
      <script type="text/javascript">
          $(document).ready(function () {
              var s = new WebNotificationServer();
              s.Connect(function (data) {
                  if (data.notification == 6000)
                      //Process the notification....Fetch the latest news 
                      alert('Notification Received:' + data.notification);
              });
          });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    </div>
    </form>
</body>
</html>
