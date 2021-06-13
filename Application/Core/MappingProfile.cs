using AutoMapper;
using Domain;
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
        }
    }
}