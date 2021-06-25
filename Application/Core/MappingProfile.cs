using AutoMapper;
using Domain;
using Application.Features;
using System.Linq;

namespace Application.Core
{
    public class MappingProfile:Profile
    {
        public MappingProfile(){
            /*
            The params in CreateMap<param 1,param 2>();
            Type of object we are maping from to Type of object we are maping to.
            */
            CreateMap<Activity,Activity>();
            CreateMap<Activity,ActivityDto>()
            .ForMember(destinationMember => destinationMember.HostUserName,options => options.MapFrom(source => source.Participants
            .FirstOrDefault(x => x.IsHost).User.UserName));
            CreateMap<ActivityPaticipants,Profiles.Profile>()
            .ForMember(destinationMember => destinationMember.DisplayName,options => options.MapFrom(source => source.User.DisplayName))
            .ForMember(destinationMember => destinationMember.UserName,options => options.MapFrom(source => source.User.UserName))
            .ForMember(destinationMember => destinationMember.Bio,options => options.MapFrom(source => source.User.Bio));
        }
    }
}