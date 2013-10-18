using System.Linq;
using System.Net.Http;
using System.Web;

namespace EmailService
{
    /// <summary>
    /// Contains extensions used on a System.Web.HttpRequest object
    /// </summary>
    public static class HttpRequestExtensions
    {
        /// <summary>
        /// Indicates whether this is a CORS request.  Based on the presence of the Origin header
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public static bool IsCorsRequest(this HttpRequest request)
        {
            return request.Headers.AllKeys.Contains("Origin");
        }

        /// <summary>
        /// Indicates whether this is a CORS request.  Based on the presence of the Origin header
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public static bool IsCorsRequest(this HttpRequestMessage request)
        {
            return request.Headers.Contains("Origin");
        }
    }
}