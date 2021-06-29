using MediatR;
using Persistent;
using Domain;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;
using Application.Core;
using Application;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Application.Interfaces;

namespace Application.Features
{
    public class ListActivities
    {
        public class Query: IRequest<Result<List<ActivityDto>>>{}

         public class Handler: IRequestHandler<Query,Result<List<ActivityDto>>>{
             private readonly DataContext _context;
             private readonly IMapper _mapper;
             private readonly IUserAccessor _userAccessor;
             public Handler(DataContext dataContext,IMapper mapper,IUserAccessor userAccessor){
                 _context = dataContext;
                 _mapper = mapper;
                 _userAccessor = userAccessor;
             }
             public async Task<Result<List<ActivityDto>>> Handle(Query request,CancellationToken cancellationToken){
                 var activities = await _context.Activities 
                //  .Include(activity => activity.Participants) // this will return List<ActivityParticipant>
                //  .ThenInclude(activityParticipant => activityParticipant.User) // then get users related to that activity.
                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,new {currentUserName = _userAccessor.GetUsername()})
                .ToListAsync(cancellationToken);
                //  var _mappedActivities = _mapper.Map<List<ActivityDto>>(activities);
                 return Result<List<ActivityDto>>.Success(activities);
             }
         }
    }
}