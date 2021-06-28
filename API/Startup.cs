using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Persistent;
using MediatR;
using Application.Features;
using AutoMapper;
using Application.Core;
using FluentValidation.AspNetCore;
using API.Middleware;
using Microsoft.AspNetCore.Identity;
using Domain;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Application.Interfaces;
using Infrastructure.Security;
using Infrastructure.Photos;
using Microsoft.AspNetCore.SignalR;
using API.SignalR;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;
        public Startup(IConfiguration configuration)
        {
            _config = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            /* Add Fluent Validation To controllers and Register all the classes that are using Fluent Validation inside <>*/
            services.AddControllers(opt => {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy)); //that every single endpoint requires authentication
            }).AddFluentValidation(config => {
                config.RegisterValidatorsFromAssemblyContaining<CreateActivity>();
            });
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(_config.GetConnectionString("DefaultConnection"));
            });
            services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy",policy => {
                    policy.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin();
                });
            });
            services.AddMediatR(typeof(ListActivities.Handler).Assembly);
            services.AddAutoMapper(typeof(MappingProfile).Assembly);

            services.AddIdentityCore<User>(opt => {
                opt.Password.RequireNonAlphanumeric = false;
            })
            .AddEntityFrameworkStores<DataContext>()
            .AddSignInManager<SignInManager<User>>();

            // this key needs to match what what we've inside TokenService
            var Key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"]));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt=> {
                opt.TokenValidationParameters = new TokenValidationParameters{
                    // validate the secret-key inside jwt token.
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = Key,
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
                /** 
                Add authentication for SignalR.
                1.Get JWT token from request params with name of "access_token" it needs to match the request param.
                2.Get path from request.
                3.Check if token is present and the reqeuest is comming from /chat i.e for SignalR connection.
                4.Set context.Token = accessToken so that we can access it inside ChatHub.cs using context which will
                give us access to user object.
                */
                opt.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context => {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if(!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat")))
                            context.Token = accessToken;
                        return Task.CompletedTask;
                    }

                };
            });
            services.AddScoped<TokenService>();
            services.AddScoped<IUserAccessor,UserAccessor>();
            services.AddAuthorization(opt => {
                opt.AddPolicy("IsActivityHost",policy => {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            }); // For edit and delete operations on an activity.Check IsHostRequirement.cs for morw info.
            services.AddTransient<IAuthorizationHandler,IsHostRequirementHandler>(); 
            // Transient will dispose IAuthorizationHandler,IsHostRequirementHandler from memory once a user is authorized.
            services.Configure<CloudinaryServices>(_config.GetSection("Cloudinary"));
            services.AddScoped<IPhotoAccessor,PhotoAccessor>();
            services.AddSignalR();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleware>();
            if (env.IsDevelopment())
            {
                // app.UseDeveloperExceptionPage(); use custom middleware instead from Line 61. 
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors("CorsPolicy");

           // we want our app to use authentication before autherization.
            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chat"); // requests coming to /chat will be handled by ChatHub.cs
            });
        }
    }
}
