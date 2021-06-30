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
using System.Linq;

namespace Application.Features
{
    public class ListActivities
    {
        public class Query: IRequest<Result<PagedList<ActivityDto>>>
        {
            public ActivityParams Params {get; set;}
        }

         public class Handler: IRequestHandler<Query,Result<PagedList<ActivityDto>>>{
             private readonly DataContext _context;
             private readonly IMapper _mapper;
             private readonly IUserAccessor _userAccessor;
             public Handler(DataContext dataContext,IMapper mapper,IUserAccessor userAccessor){
                 _context = dataContext;
                 _mapper = mapper;
                 _userAccessor = userAccessor;
             }
             public async Task<Result<PagedList<ActivityDto>>> Handle(Query request,CancellationToken cancellationToken){
                 /** 
                 we can't use await below with _context.Activities as we're not querying database but rather we're deferring this query.
                 Otherwise we'll get an error - 
                 ERROR: IQueryable<ActivityDto>' does not contain a definition for 'GetAwaiter'.
                 */
                 var query = _context.Activities
                 .Where(activity => activity.Date >= request.Params.StartDate)
                 .OrderBy(activity => activity.Date)
                 .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,new {currentUserName = _userAccessor.GetUsername()})
                 .AsQueryable();

                if(request.Params.IsGoing && !request.Params.IsHosting){
                    query = query
                    .Where(activity => activity.participants.Any(participant => participant.UserName == _userAccessor.GetUsername()));
                }

                 if(!request.Params.IsGoing && request.Params.IsHosting){
                    query = query
                    .Where(activity => activity.HostUserName == _userAccessor.GetUsername());
                }
                //  var _mappedActivities = _mapper.Map<PagedList<ActivityDto>>(activities);
                 return Result<PagedList<ActivityDto>>.Success(
                     await PagedList<ActivityDto>.CreateAsyncList(
                     query,
                     request.Params.PageNumber,
                     request.Params.PageSize)  
                     );
             }
         }
    }
}