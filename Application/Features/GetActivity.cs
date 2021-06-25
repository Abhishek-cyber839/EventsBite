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
             public Handler(DataContext dataContext,IMapper mapper){
                 _context = dataContext;
                _mapper = mapper;
             }
             public async Task<Result<ActivityDto>> Handle(Query request,CancellationToken cancellationToken){
                 var activity = await _context.Activities
                 .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                 .FirstOrDefaultAsync(x => x.Id == request.activity_id);
                 return Result<ActivityDto>.Success(activity);
             }
         }
    }
}