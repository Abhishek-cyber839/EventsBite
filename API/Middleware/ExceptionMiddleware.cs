using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
using System.Threading.Tasks;
using System;
using Application.Core;
using System.Text.Json;
using System.Net; // for http status codes. 

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        // It has access to requests and responses coming to the route.
        private readonly RequestDelegate _next;
        // we can Log errors 
        private readonly ILogger<ExceptionMiddleware> _Logger;
        // Using IHostEnvironment we can check whether we're in development or production environment.
        private readonly IHostEnvironment _env;
        public ExceptionMiddleware(RequestDelegate next,ILogger<ExceptionMiddleware> Logger,IHostEnvironment env){
            _next = next;
            _Logger = Logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context){
            try{
                // HttpContext could be request or response
                // Everything successful : pass this request or response to next middleware
                await _next(context);
            }
            catch(Exception exception){
                _Logger.LogError(exception,exception.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int) HttpStatusCode.InternalServerError; // status code - 500.
                var response = _env.IsDevelopment() ? new AppException(context.Response.StatusCode,exception.Message,exception.StackTrace?.ToString()) :
                new AppException(context.Response.StatusCode,"Server Error");
                /**
                 response = {   
                     Status = ....;
                     Message = ....;
                     Details = .....;
                     }
                */
                // Add Line 33 ,so that we can use CamelCase Naming Convention inside response object.
                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
                var json = JsonSerializer.Serialize(response,options);
                await context.Response.WriteAsync(json);
            }
        }
    }
}