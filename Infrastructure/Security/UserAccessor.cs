using Application.Interfaces;
using System.Security.Claims;
using Domain;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class UserAccessor:IUserAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        /* 
          IHttpContextAccessor httpContextAccessor have access to the user object that comes with the request and using
          which we can get token and username of that user who is sending that request.For example- a user send post 
          request on /createActivity , we will grab his username and set IsHost property inside ActivityParticipants table to "true".
        */
        public UserAccessor(IHttpContextAccessor httpContextAccessor){
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetUsername(){
            return _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
        }
    }
}