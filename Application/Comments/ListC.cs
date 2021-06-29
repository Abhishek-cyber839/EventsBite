using MediatR;
using Persistent;
using Domain;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Threading;
using System;
using FluentValidation;
using Application.Core;
using Application.Interfaces;
using Application.Features;
using AutoMapper;
using System.Collections;
using System.Linq;
using AutoMapper.QueryableExtensions;

namespace Application.Comments
{
    public class ListC 
    {
        public class Query : IRequest<Result<List<CommentDto>>>{
             public Guid ActivityId{get; set;}
        }
        public class Handler:IRequestHandler<Query,Result<List<CommentDto>>>{
            
             private readonly DataContext _context;
             private readonly IMapper _mapper;
             public Handler(DataContext dataContext,IMapper mapper){
                 _context = dataContext;
                 _mapper = mapper;
             }

             public async Task<Result<List<CommentDto>>> Handle(Query request,CancellationToken cancellationToken){
                 /** 
                  1.Get all comments matching that request.ActivityId
                  2.Order them by CreatedAt
                  3.It will give us each comment of type Comment so we need to map it to CommentDto using ProjectTo<> which will use MappingProfile.cs.
                  use AutoMapper.QueryableExtensions for step 3;
                 */
                  var comments = await _context.Comments
                  .Where(comment => comment.Activity.Id == request.ActivityId)
                  .OrderByDescending(comment => comment.CreatedAt)
                  .ProjectTo<CommentDto>(_mapper.ConfigurationProvider)
                  .ToListAsync();
                  return Result<List<CommentDto>>.Success(comments);
             }
        }
        
    }
}