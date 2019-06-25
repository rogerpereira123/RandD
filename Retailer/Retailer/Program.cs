using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;
using System.Net.Cache;
using System.Web;
using System.Security.Cryptography.X509Certificates;
namespace Retailer
{
    public static class Constants
    {
        public static readonly string RWEB_HOST_LIVE = @"https://rweb.dishnetwork.com";
        public static readonly string RETAILER_HOST_LIVE = @"https://retailer.dish.com";
    }
    class Program
    {
        static long getSWETS()
        {
            
            return Convert.ToInt64(DateTime.Now.Subtract(new DateTime(1970, 1, 1, 0, 0, 0)).TotalMilliseconds);
        }
        static string getSN(string response)
        {
            var splits = response.Split(new string[1] 
                {"<frame name=\"_swe\" title=\"\" src=\"/prmportal/start.swe?SWECmd=GetCachedFrame&_sn="}, StringSplitOptions.None);
            var moresplits = splits[1].Split(new string[1] { "&SWEC=1&SWEFrame=top._swe&SRN=\"" }, StringSplitOptions.None);
            return moresplits[0];
        }
        static void RetailerCare()
        {
            ServicePointManager.ServerCertificateValidationCallback += new System.Net.Security.RemoteCertificateValidationCallback(customXertificateValidation);
            HttpRequestCachePolicy noCachePolicy = new HttpRequestCachePolicy(HttpRequestCacheLevel.NoCacheNoStore);
            HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create(Constants.RETAILER_HOST_LIVE + "/prmportal/start.swe?SWECmd=Start&SWEHo=retailer.dish.com");
            req.Method = "GET";
            req.CookieContainer = new CookieContainer();
            req.Credentials = new NetworkCredential("343197", "Dish1234");

            var httpWebResponse = (HttpWebResponse)req.GetResponse();
            var responseStream = httpWebResponse.GetResponseStream();
            var streamReader = new StreamReader(responseStream, System.Text.Encoding.ASCII);
            var strResponse = streamReader.ReadToEnd();

            streamReader.Close();
            responseStream.Close();
            httpWebResponse.Close();
            CookieCollection cookieCollection = null;
            if (httpWebResponse.Cookies.Count > 0)
            {
                if (cookieCollection == null)
                    cookieCollection = httpWebResponse.Cookies;
                else
                {
                    foreach (Cookie RespCookie in httpWebResponse.Cookies)
                    {
                        bool bMatch = false;
                        foreach (Cookie ReqCookie in cookieCollection)
                        {
                            if (ReqCookie.Name == RespCookie.Name)
                            {
                                ReqCookie.Value = RespCookie.Value;
                                bMatch = true;
                                break;
                            }
                        }
                        if (!bMatch)
                            cookieCollection.Add(RespCookie);
                    }
                }
            }
            

            req = (HttpWebRequest)HttpWebRequest.Create(Constants.RETAILER_HOST_LIVE + "/prmportal/start.swe");
            req.Method = "POST";
            req.Credentials = new NetworkCredential("343197", "Dish1234");
            req.CookieContainer = new CookieContainer();
            req.CookieContainer.Add(cookieCollection);
            req.ContentType = "application/x-www-form-urlencoded";
            var swets = getSWETS();
            var sn = getSN(strResponse);
            var postData = "s_1_1_11_0=343197&s_1_1_12_0=Dish1234&SWEFo=SWEForm1_0&SWEField=s_1_1_13_0&SWENeedContext=true&SWENoHttpRedir=false&W=t&SWECmd=InvokeMethod&SWEMethod=AppletLogin&SWERowIds=&SWESP=false&SWEVI=&SWESPNR=&SWEPOC=&SWESPNH=&SWEH=&SWETargetView=&SWETF=_top&SWEDIC=false&_sn=";
            postData += HttpUtility.UrlEncode(sn);
            postData += "&SWEReqRowId=0&SWEView=RTL+Login+View&SWEC=1&SWERowId=VRId-0&SWETVI=&SWEW=&SWEBID="+swets.ToString().Substring(0 , 10)+"&SWEM=&SRN=&SWESPa=&SWETS="+swets+"&SWEContainer=&SWEWN=&SWEApplet=Login+Applet+%28Login+View%29&SWETA=";
            
            byte[] dataByteArray = Encoding.ASCII.GetBytes(postData);
            req.ContentLength = dataByteArray.Length;

            Stream requestStream = req.GetRequestStream();
            if (requestStream.CanWrite)
            {
                requestStream.Write(dataByteArray, 0, dataByteArray.Length);
            }
            requestStream.Close();
            httpWebResponse = (HttpWebResponse)req.GetResponse();
            responseStream = httpWebResponse.GetResponseStream();
            if (httpWebResponse.Cookies.Count > 0)
            {
                if (cookieCollection == null)
                    cookieCollection = httpWebResponse.Cookies;
                else
                {
                    foreach (Cookie RespCookie in httpWebResponse.Cookies)
                    {
                        bool bMatch = false;
                        foreach (Cookie ReqCookie in cookieCollection)
                        {
                            if (ReqCookie.Name == RespCookie.Name)
                            {
                                ReqCookie.Value = RespCookie.Value;
                                bMatch = true;
                                break;
                            }
                        }
                        if (!bMatch)
                            cookieCollection.Add(RespCookie);
                    }
                }
            }
            streamReader = new StreamReader(responseStream, System.Text.Encoding.ASCII);
            strResponse = streamReader.ReadToEnd();
            var srn = getSRN(strResponse);
            streamReader.Close();
            responseStream.Close();
            httpWebResponse.Close();

          


            req = (HttpWebRequest)HttpWebRequest.Create(Constants.RETAILER_HOST_LIVE + "/prmportal/start.swe?SWENeedContext=false&SWECmd=GetCachedFrame&SWEACn=4634&SWEC=2&SWEFrame=top._sweclient._swecontent._sweview&SWEBID=-1&SRN="+srn+"&SWETS=");
            req.Method = "GET";
            req.ContentType = "application/x-www-form-urlencoded";
            req.Credentials = new NetworkCredential("SHANNONDDRA", "Shannon12");
            req.CachePolicy = noCachePolicy;
            req.CookieContainer = new CookieContainer();
            req.CookieContainer.Add(cookieCollection);
           
            
            httpWebResponse = (HttpWebResponse)req.GetResponse();
            if (httpWebResponse.Cookies.Count > 0)
            {
                if (cookieCollection == null)
                    cookieCollection = httpWebResponse.Cookies;
                else
                {
                    foreach (Cookie RespCookie in httpWebResponse.Cookies)
                    {
                        bool bMatch = false;
                        foreach (Cookie ReqCookie in cookieCollection)
                        {
                            if (ReqCookie.Name == RespCookie.Name)
                            {
                                ReqCookie.Value = RespCookie.Value;
                                bMatch = true;
                                break;
                            }
                        }
                        if (!bMatch)
                            cookieCollection.Add(RespCookie);
                    }
                }
            }
            responseStream = httpWebResponse.GetResponseStream();
            streamReader = new StreamReader(responseStream, System.Text.Encoding.ASCII);
            strResponse = streamReader.ReadToEnd();
           
            streamReader.Close();
            responseStream.Close();
            httpWebResponse.Close();


            req = (HttpWebRequest)HttpWebRequest.Create(Constants.RETAILER_HOST_LIVE + "/prmportal/start.swe?SWENeedContext=false&SWECmd=GotoPageTab&SWEC=2&SWEBID=-1&SRN=" + srn + "&SWETS=&SWEScreen=RTL+RWeb+Tools+Business&SWEVST=-1&SWETS=" + swets + "&SWEC=2&SWENoHttpRedir=true");
            req.Method = "GET";
            req.ContentType = "application/x-www-form-urlencoded";
            req.Credentials = new NetworkCredential("SHANNONDDRA", "Shannon12");
            req.CachePolicy = noCachePolicy;
            req.CookieContainer = new CookieContainer();
             req.CookieContainer.Add(cookieCollection);


             httpWebResponse = (HttpWebResponse)req.GetResponse();
             if (httpWebResponse.Cookies.Count > 0)
             {
                 if (cookieCollection == null)
                     cookieCollection = httpWebResponse.Cookies;
                 else
                 {
                     foreach (Cookie RespCookie in httpWebResponse.Cookies)
                     {
                         bool bMatch = false;
                         foreach (Cookie ReqCookie in cookieCollection)
                         {
                             if (ReqCookie.Name == RespCookie.Name)
                             {
                                 ReqCookie.Value = RespCookie.Value;
                                 bMatch = true;
                                 break;
                             }
                         }
                         if (!bMatch)
                             cookieCollection.Add(RespCookie);
                     }
                 }
             }
             responseStream = httpWebResponse.GetResponseStream();
             streamReader = new StreamReader(responseStream, System.Text.Encoding.ASCII);
             strResponse = streamReader.ReadToEnd();
             var buisinessCenterResponse = strResponse;
             streamReader.Close();
             responseStream.Close();
             httpWebResponse.Close();

             req = (HttpWebRequest)HttpWebRequest.Create(getRedirectURL(strResponse, "top._sweclient._sweviewbar.location.replace('"));
             req.Method = "GET";
             req.ContentType = "application/x-www-form-urlencoded";
             req.Credentials = new NetworkCredential("SHANNONDDRA", "Shannon12");
             req.CachePolicy = noCachePolicy;
             req.CookieContainer = new CookieContainer();
             req.CookieContainer.Add(cookieCollection);





             req = (HttpWebRequest)HttpWebRequest.Create(Constants.RETAILER_HOST_LIVE + "/prmportal/start.swe");
             req.Method = "POST";
             req.ContentType = "application/x-www-form-urlencoded";
             req.Credentials = new NetworkCredential("SHANNONDDRA", "Shannon12");
             string SWEC, SRN, SWEFrame = string.Empty;
             postData = getPostdataForReturnAuthorizationPostRequest(buisinessCenterResponse ,swets.ToString(), out SWEC , out SWEFrame , out SRN);
             /*postData = "SWEFo=SWEForm4_0&SWEField=s_4_1_2_0&SWENeedContext=true&SWENoHttpRedir=true&SWECmd=InvokeMethod";
             postData += "&SWEMethod=ShowPopup&SWERowIds=&SWESP=true&SWEVI=&SWESPNR=&SWEPOC=&SWESPNH=&SWETargetView=&SWETF=_blank&SWEH=&SWEDIC=true";
             postData += "&SWEReqRowId=1&SWEView=" + HttpUtility.JavaScriptStringEncode("RTL Rweb Tools Business") + "&SWEC=12";
             postData += "&SWERowId=0-3MDR9&SWETVI=&SWEBID="+swets.ToString().Substring(0, 10)+"&SWEM=&SWEW=&SRN=" + srn + "&SWESPa=&SWETS="+swets+"&SWEContainer=&SWEWN=";
             postData += "&SWEApplet=" + HttpUtility.JavaScriptStringEncode("RTL Rweb Tools Partner Manager Return Authorization");
             postData += "&SWETA=" + HttpUtility.JavaScriptStringEncode("RTL Rweb Tools Return Authorization");*/




             req.CookieContainer = new CookieContainer();
             req.CookieContainer.Add(cookieCollection);

             dataByteArray = Encoding.ASCII.GetBytes(postData);
             req.ContentLength = dataByteArray.Length;

             requestStream = req.GetRequestStream();
             if (requestStream.CanWrite)
             {
                 requestStream.Write(dataByteArray, 0, dataByteArray.Length);
             }
             requestStream.Close();

             httpWebResponse = (HttpWebResponse)req.GetResponse();
             if (httpWebResponse.Cookies.Count > 0)
             {
                 if (cookieCollection == null)
                     cookieCollection = httpWebResponse.Cookies;
                 else
                 {
                     foreach (Cookie RespCookie in httpWebResponse.Cookies)
                     {
                         bool bMatch = false;
                         foreach (Cookie ReqCookie in cookieCollection)
                         {
                             if (ReqCookie.Name == RespCookie.Name)
                             {
                                 ReqCookie.Value = RespCookie.Value;
                                 bMatch = true;
                                 break;
                             }
                         }
                         if (!bMatch)
                             cookieCollection.Add(RespCookie);
                     }
                 }
             }
             responseStream = httpWebResponse.GetResponseStream();
             streamReader = new StreamReader(responseStream, System.Text.Encoding.ASCII);
             strResponse = streamReader.ReadToEnd();

             streamReader.Close();
             responseStream.Close();
             httpWebResponse.Close();

             //req = (HttpWebRequest)HttpWebRequest.Create(Constants.RETAILER_HOST_LIVE +"/prmportal/start.swe?SWECmd=GetCachedFrame&SWEC=" + SWEC + "&SWEFrame=portalPopup0&SRN=" + SRN);
             req = (HttpWebRequest)HttpWebRequest.Create(Constants.RETAILER_HOST_LIVE + "/prmportal/start.swe?SWECmd=Refresh&SWEVI=&SWEView=RTL+RWeb+Tools+Business&SWEC=" + SWEC + "&SRN=" + srn);
             req.Method = "GET";
             req.Credentials = new NetworkCredential("SHANNONDDRA", "Shannon12");
             req.ContentType = "application/x-www-form-urlencoded";
             req.

            
             req.CookieContainer = new CookieContainer();
             req.CookieContainer.Add(cookieCollection);

             

             httpWebResponse = (HttpWebResponse)req.GetResponse();
             if (httpWebResponse.Cookies.Count > 0)
             {
                 if (cookieCollection == null)
                     cookieCollection = httpWebResponse.Cookies;
                 else
                 {
                     foreach (Cookie RespCookie in httpWebResponse.Cookies)
                     {
                         bool bMatch = false;
                         foreach (Cookie ReqCookie in cookieCollection)
                         {
                             if (ReqCookie.Name == RespCookie.Name)
                             {
                                 ReqCookie.Value = RespCookie.Value;
                                 bMatch = true;
                                 break;
                             }
                         }
                         if (!bMatch)
                             cookieCollection.Add(RespCookie);
                     }
                 }
             }
             responseStream = httpWebResponse.GetResponseStream();
             streamReader = new StreamReader(responseStream, System.Text.Encoding.ASCII);
             strResponse = streamReader.ReadToEnd();

             streamReader.Close();
             responseStream.Close();
             httpWebResponse.Close();

             req = (HttpWebRequest)HttpWebRequest.Create(getRedirectURL(strResponse, "top._sweclient._swescrnbar.location.replace('"));
             req.Method = "GET";
             req.ContentType = "application/x-www-form-urlencoded";
             req.Credentials = new NetworkCredential("SHANNONDDRA", "Shannon12");




             req.CookieContainer = new CookieContainer();
             req.CookieContainer.Add(cookieCollection);



             httpWebResponse = (HttpWebResponse)req.GetResponse();
             if (httpWebResponse.Cookies.Count > 0)
             {
                 if (cookieCollection == null)
                     cookieCollection = httpWebResponse.Cookies;
                 else
                 {
                     foreach (Cookie RespCookie in httpWebResponse.Cookies)
                     {
                         bool bMatch = false;
                         foreach (Cookie ReqCookie in cookieCollection)
                         {
                             if (ReqCookie.Name == RespCookie.Name)
                             {
                                 ReqCookie.Value = RespCookie.Value;
                                 bMatch = true;
                                 break;
                             }
                         }
                         if (!bMatch)
                             cookieCollection.Add(RespCookie);
                     }
                 }
             }
             responseStream = httpWebResponse.GetResponseStream();
             streamReader = new StreamReader(responseStream, System.Text.Encoding.ASCII);
             strResponse = streamReader.ReadToEnd();

             streamReader.Close();
             responseStream.Close();
             httpWebResponse.Close();

             req = (HttpWebRequest)HttpWebRequest.Create(Constants.RETAILER_HOST_LIVE + "/prmportal/start.swe?SWENeedContext=false&SWECmd=Logoff&SWEC=" + SWEC + "&SWEBID=-1&SRN=" + srn + "&SWETS=");
             req.Method = "GET";
             req.ContentType = "application/x-www-form-urlencoded";
             req.Credentials = new NetworkCredential("SHANNONDDRA", "Shannon12");




             req.CookieContainer = new CookieContainer();
             req.CookieContainer.Add(cookieCollection);



             httpWebResponse = (HttpWebResponse)req.GetResponse();
             if (httpWebResponse.Cookies.Count > 0)
             {
                 if (cookieCollection == null)
                     cookieCollection = httpWebResponse.Cookies;
                 else
                 {
                     foreach (Cookie RespCookie in httpWebResponse.Cookies)
                     {
                         bool bMatch = false;
                         foreach (Cookie ReqCookie in cookieCollection)
                         {
                             if (ReqCookie.Name == RespCookie.Name)
                             {
                                 ReqCookie.Value = RespCookie.Value;
                                 bMatch = true;
                                 break;
                             }
                         }
                         if (!bMatch)
                             cookieCollection.Add(RespCookie);
                     }
                 }
             }
             responseStream = httpWebResponse.GetResponseStream();
             streamReader = new StreamReader(responseStream, System.Text.Encoding.ASCII);
             strResponse = streamReader.ReadToEnd();

             streamReader.Close();
             responseStream.Close();
             httpWebResponse.Close();

             //LogOnToRetailerSite(cookieCollection);


        }
        static Uri getRedirectURL(string response, string stringToLookfor)
        {
            
            var baseUrl = Constants.RETAILER_HOST_LIVE;
            if (!response.Contains(stringToLookfor)) return new Uri(baseUrl);
            var splits = response.Split(new string[1] { stringToLookfor }, StringSplitOptions.None);
            var u = splits[1].Split(new string[1] { "');" }, StringSplitOptions.None)[0];
            return new Uri(baseUrl + u);
        }
        static string getPostdataForReturnAuthorizationPostRequest(string response,string swets, out string SWEC , out string SWEFrame, out string SRN )
        {
            SRN = ""; SWEFrame = "top._sweclient._sweviewbar"; SWEC = "";

            if (!response.Contains("Return Authorization")) return "";

            var moreSplits = response.Split(new string[1] { "Access the Return Authorization tool for  Return Authorizations, redeployment requests, and the smartcard sales order form.<br></td></tr></table></td></tr></table>" }, StringSplitOptions.None);
            moreSplits = moreSplits[1].Split(new string[1] { "</form>" }, StringSplitOptions.None);
            var allInputs = moreSplits[0];
            moreSplits = allInputs.Split(new string[1] {"<input type=\"hidden\" name='" }, StringSplitOptions.None);
            string result = "";
            var cnt = 0;
            foreach(var s in moreSplits)
            {
                if (s == "") { cnt++; continue; }
                var newSplits = s.Split(new string[1] { " " }, StringSplitOptions.None);
                var name = newSplits[0].Replace("'", "");
                var value = newSplits[1].Replace("value='", "").Replace("'", "");
              
                if (name == "SWEField") 
                    value = value == "" ? "s_4_1_3_0" : value;
                if (name == "SWENoHttpRedir")
                    value = "true";
                if (name == "SWEBID") 
                    value = swets.Substring(0 , 10);
                if (name == "SWETS") 
                    value = swets;
                if (name == "SWEMethod")
                    value = "ShowPopup";
                if (name == "SWESP")
                    value = "true";
                if (name == "SWEDIC")
                    value = "true";
                if (name == "SWEView")
                    value = HttpUtility.UrlEncode("RTL RWeb Tools Business");
                if (name == "SWEApplet")
                    value = HttpUtility.UrlEncode("RTL RWeb Tools Partner Manager Return Authorization");
                if (name == "SWETA")
                    value = HttpUtility.UrlEncode("RTL RWeb Tools Return Authorization");
                if (name == "SWEReqRowId")
                    value = "1";
                if (name.ToLower() == "swec") SWEC = value;
                if (name.ToLower() == "sweframe") SWEFrame = value;
                if (name.ToLower() == "srn") SRN = value;

                result += name + "=" + value;
                if(cnt++ < moreSplits.Length -1)
                    result+="&";
            }

            return result;


                

        }
        static string getSRN(string response)
        {
            string result = "";
            var splits = response.Split(new string[1] { "&SWETS=" }, StringSplitOptions.None);
            if (splits.Length > 0)
            {
                var moreSplits = splits[0].Split(new string[1] { "&SRN=" }, StringSplitOptions.None);
                if (moreSplits.Length > 0)
                    result = moreSplits[1];
            }
            return result;
        }
        protected static bool customXertificateValidation(object sender, X509Certificate cert, X509Chain chain, System.Net.Security.SslPolicyErrors error)
        {
            bool bRet = false;
            if (cert.Subject.ToLower().Contains("dish.com")) bRet = true;
            if (cert.Subject.ToLower().Contains("dishnetwork.com")) bRet = true;
            if (cert.Subject.ToLower().Contains("cn=rweb.echostar.com")) bRet = true;
            if (cert.Subject.ToLower().Contains("safe7.com")) bRet = true;

            return bRet;
        }

        static bool LogOnToRetailerSite(CookieCollection cookieCollection)
        {
            bool result = false;
            try
            {

                var cookieContainer = new CookieContainer();

                ServicePointManager.ServerCertificateValidationCallback += new System.Net.Security.RemoteCertificateValidationCallback(customXertificateValidation);
                string strUrl = Constants.RWEB_HOST_LIVE + "/login/login.asp";
                Uri uri = new Uri(strUrl);

                HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(uri);


                httpWebRequest.CookieContainer = cookieContainer;

                HttpWebResponse httpWebResponse = (HttpWebResponse)httpWebRequest.GetResponse();

                if (httpWebResponse.Cookies.Count > 0)
                {
                    if (cookieCollection == null)
                        cookieCollection = httpWebResponse.Cookies;
                    else
                    {
                        foreach (Cookie RespCookie in httpWebResponse.Cookies)
                        {
                            bool bMatch = false;
                            foreach (Cookie ReqCookie in cookieCollection)
                            {
                                if (ReqCookie.Name == RespCookie.Name)
                                {
                                    ReqCookie.Value = RespCookie.Value;
                                    bMatch = true;
                                    break;
                                }
                            }
                            if (!bMatch)
                                cookieCollection.Add(RespCookie);
                        }
                    }
                }
                
               
                //Get the stream associated with the response.
                Stream responseStream = httpWebResponse.GetResponseStream();
                StreamReader streamReader = new StreamReader(responseStream, System.Text.Encoding.ASCII);
                string strLoginResponse = streamReader.ReadToEnd();
                streamReader.Close();
                responseStream.Close();
                httpWebResponse.Close();


                httpWebRequest = (HttpWebRequest)WebRequest.Create(uri);
                cookieContainer.Add(cookieCollection);
                httpWebRequest.CookieContainer = cookieContainer;
                httpWebRequest.Method = "post";
                httpWebRequest.ContentType = "application/x-www-form-urlencoded";
                string postdata = "txtRetailerNo=SHANNONDDRA&txtRetailerPin=Shannon12&hidFormAction=VALIDATELOGIN&hidIsNetscape=";
                byte[] dataByteArray = Encoding.ASCII.GetBytes(postdata);
                httpWebRequest.ContentLength = dataByteArray.Length;

                Stream requestStream = httpWebRequest.GetRequestStream();
                if (requestStream.CanWrite)
                {
                    requestStream.Write(dataByteArray, 0, dataByteArray.Length);
                }
                requestStream.Close();

                httpWebResponse = (HttpWebResponse)httpWebRequest.GetResponse();

                if (httpWebResponse.Cookies.Count > 0)                         //***********************************
                {
                    if (cookieCollection == null)
                        cookieCollection = httpWebResponse.Cookies;
                    else
                    {
                        foreach (Cookie RespCookie in httpWebResponse.Cookies)
                        {
                            bool bMatch = false;
                            foreach (Cookie ReqCookie in cookieCollection)
                            {
                                if (ReqCookie.Name == RespCookie.Name)
                                {
                                    ReqCookie.Value = RespCookie.Value;
                                    bMatch = true;
                                    break;
                                }
                            }
                            if (!bMatch)
                                cookieCollection.Add(RespCookie);
                        }
                    }
                }
                
                //Get the stream associated with the response.
                responseStream = httpWebResponse.GetResponseStream();
                streamReader = new StreamReader(responseStream, System.Text.Encoding.ASCII);
                strLoginResponse = streamReader.ReadToEnd();
                streamReader.Close();
                responseStream.Close();
                httpWebResponse.Close();
               

              

            }
            catch (Exception ex)
            {
                //WriteLog.Write("LogOnToRetialerSite:" + ex.Message);

            }
            return result;
        }

        static void Main(string[] args)
        {
            RetailerCare();
        }

    }
}
