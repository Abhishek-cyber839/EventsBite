using MediatR;
using Persistent;
using Domain;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;
using System;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Application.Profiles;
using System.Linq;

namespace Application.Profiles
{
    public class ListActivites
    {
         public class Query: IRequest<Result<List<UserActivityDto>>>
        {
            public string Username {get; set;}
            public string Predicate {get; set;}
        }

         public class Handler: IRequestHandler<Query,Result<List<UserActivityDto>>>{
             private readonly DataContext _context;
             private readonly IMapper _mapper;
             public Handler(DataContext dataContext,IMapper mapper){
                 _context = dataContext;
                 _mapper = mapper;
             }

          public async Task<Result<List<UserActivityDto>>> Handle(Query request,CancellationToken cancellationToken){
                  var query = _context.ActivitiesParticipants
                 .Where(participant => participant.User.UserName == request.Username)
                 .OrderBy(participant => participant.Activity.Date)
                 .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                 .AsQueryable();
                 query = request.Predicate switch
                 {
                     "past" => query.Where(activity => activity.Date <= DateTime.Now),
                     "hosting" => query.Where(activity => activity.HostUserName  == request.Username),
                     _ => query.Where(activity => activity.Date > DateTime.Now), 
                 };
                 var activities = await query.ToListAsync();
                 return Result<List<UserActivityDto>>.Success(activities);
                    
             }    
         }
    }
}