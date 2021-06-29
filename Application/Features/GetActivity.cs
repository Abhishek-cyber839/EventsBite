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
using Application.Interfaces;

namespace Application.Features
{
    public class GetActivity
    {
        public class Query: IRequest<Result<ActivityDto>>{
            public Guid activity_id { get; set;}
        }

         public class Handler: IRequestHandler<Query,Result<ActivityDto>>{
             private readonly DataContext _context;
             private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
             public Handler(DataContext dataContext,IMapper mapper,IUserAccessor userAccessor){
                 _context = dataContext;
                 _mapper = mapper;
                 _userAccessor = userAccessor;
             }
             public async Task<Result<ActivityDto>> Handle(Query request,CancellationToken cancellationToken){
                 var activity = await _context.Activities
                 .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,new {currentUserName = _userAccessor.GetUsername()})
                 .FirstOrDefaultAsync(x => x.Id == request.activity_id);
                 return Result<ActivityDto>.Success(activity);
             }
         }
    }
}