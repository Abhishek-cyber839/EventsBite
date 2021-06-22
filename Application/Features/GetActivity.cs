using MediatR;
using Persistent;
using Domain;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;
using System;
using Application.Core;

namespace Application.Features
{
    public class GetActivity
    {
        public class Query: IRequest<Result<Activity>>{
            public Guid activity_id { get; set;}
        }

         public class Handler: IRequestHandler<Query,Result<Activity>>{
             private readonly DataContext _context;
             public Handler(DataContext dataContext){
                 _context = dataContext;
             }
             public async Task<Result<Activity>> Handle(Query request,CancellationToken cancellationToken){
                 var activity = await _context.Activities.FindAsync(request.activity_id);
                 return Result<Activity>.Success(activity);
             }
         }
    }
}