using MediatR;
using Persistent;
using Domain;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;
using System;

namespace Application.Features
{
    public class GetActivity
    {
        public class Query: IRequest<Activity>{
            public Guid activity_id { get; set;}
        }

         public class Handler: IRequestHandler<Query,Activity>{
             private readonly DataContext _context;
             public Handler(DataContext dataContext){
                 _context = dataContext;
             }
             public async Task<Activity> Handle(Query request,CancellationToken cancellationToken){
                 return await _context.Activities.FindAsync(request.activity_id);
             }
         }
    }
}