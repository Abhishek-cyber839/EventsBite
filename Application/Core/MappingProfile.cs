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
            Use Profiles.Profile for user profile object as there's already a type Profile in AutoMapper.
            */
            CreateMap<Activity,Activity>();
            CreateMap<Activity,ActivityDto>()
            .ForMember(destinationMember => destinationMember.HostUserName,options => options.MapFrom(source => source.Participants
            .FirstOrDefault(x => x.IsHost).User.UserName));
            CreateMap<ActivityPaticipants,ParticipantDto>()
            .ForMember(destinationMember => destinationMember.DisplayName,options => options.MapFrom(source => source.User.DisplayName))
            .ForMember(destinationMember => destinationMember.UserName,options => options.MapFrom(source => source.User.UserName))
            .ForMember(destinationMember => destinationMember.Bio,options => options.MapFrom(source => source.User.Bio))
            .ForMember(destinationMember => destinationMember.Image,
                       options => options.MapFrom(source => source.User.Photos.FirstOrDefault(photo => photo.IsMainPhoto).Url));
            CreateMap<User,Profiles.Profile>()
            .ForMember(destinationMember => destinationMember.Image,
                       options => options.MapFrom(source => source.Photos.FirstOrDefault(photo => photo.IsMainPhoto).Url));
             CreateMap<Comment,CommentDto>()
            .ForMember(destinationMember => destinationMember.DisplayName,options => options.MapFrom(source => source.Author.DisplayName))
            .ForMember(destinationMember => destinationMember.UserName,options => options.MapFrom(source => source.Author.UserName))
            .ForMember(destinationMember => destinationMember.Image,
                       options => options.MapFrom(source => source.Author.Photos.FirstOrDefault(photo => photo.IsMainPhoto).Url));
        }
    }
}