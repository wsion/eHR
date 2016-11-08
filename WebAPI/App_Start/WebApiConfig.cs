using eHR.Repository;
using System.Web.Http;
using System.Web.Http.OData.Builder;

namespace eHR.WebAPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            //config.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{id}",
            //    defaults: new { id = RouteParameter.Optional }
            //);

            config.MessageHandlers.Add(new PreflightRequestsHandler());

            ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
            builder.EntitySet<Department>("Department");
            builder.EntitySet<Employee>("Employee");
            config.Routes.MapODataRoute("odata", "odata", builder.GetEdmModel());
        }
    }
}
