using Owin;
using Microsoft.Owin;


[assembly: OwinStartup(typeof(eHR.WebAPI.Startup))]
namespace eHR.WebAPI
{
    public class Startup
    {
        public void ConfigureAuth(IAppBuilder app)
        {
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
        }
    }
}