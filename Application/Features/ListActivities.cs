using MediatR;
using Persistent;
using Domain;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;

namespace Application.Features
{
    public class ListActivities
    {
        public class Query: IRequest<List<Activity>>{}

         public class Handler: IRequestHandler<Query,List<Activity>>{
             private readonly DataContext _context;
             public Handler(DataContext dataContext){
                 _context = dataContext;
             }
             public async Task<List<Activity>> Handle(Query request,CancellationToken cancellationToken){
                 return await _context.Activities.ToListAsync();
             }
         }
    }
}