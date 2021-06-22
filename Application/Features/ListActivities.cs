using MediatR;
using Persistent;
using Domain;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;
using Application.Core;

namespace Application.Features
{
    public class ListActivities
    {
        public class Query: IRequest<Result<List<Activity>>>{}

         public class Handler: IRequestHandler<Query,Result<List<Activity>>>{
             private readonly DataContext _context;
             public Handler(DataContext dataContext){
                 _context = dataContext;
             }
             public async Task<Result<List<Activity>>> Handle(Query request,CancellationToken cancellationToken){
                 return Result<List<Activity>>.Success(await _context.Activities.ToListAsync());
             }
         }
    }
}