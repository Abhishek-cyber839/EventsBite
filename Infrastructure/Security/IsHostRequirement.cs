using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Persistent;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Security
{
    /** 
     Using this custom authorization we will allow only users who are host of an activity to edit or delete that activity.
    */
    public class IsHostRequirement: IAuthorizationRequirement{}

    public class IsHostRequirementHandler: AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public IsHostRequirementHandler(DataContext dbContext,IHttpContextAccessor httpContextAccessor){
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,IsHostRequirement hostRequirement){
            /**
             NameIdentifier will give access to user Id and our query will be more efficient as primary key made up of 
             user ID and Activity Id inside ActivityParticpants table.
            */
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userId == null) return Task.CompletedTask; // It means user is unauthorized.
            /** Get activity Id from Route using httpcontext.*/
            var _idInsideRoute = _httpContextAccessor.HttpContext?.Request.RouteValues["id"]?.ToString();
            // Not Working - ** RouteValues.SingleOrDefault(activity => activity.Key == "id").Value?.ToString() ** 
            var activityId = Guid.Parse(_idInsideRoute);
            var participant = _dbContext.ActivitiesParticipants
            .AsNoTracking() // don't keep the ActivityParticipant object in memory.
            .SingleOrDefaultAsync(activityParticipant => activityParticipant.UserId == userId && 
                                                         activityParticipant.ActivityId == activityId).Result;
            if(participant == null) return Task.CompletedTask;
            if(participant.IsHost) context.Succeed(hostRequirement); // user is authorized.
            return Task.CompletedTask;
        }
    }
}