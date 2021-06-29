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
using AutoMapper;
using System.Collections;
using System.Linq;
using AutoMapper.QueryableExtensions;
using Application.Profiles;
using Application.Interfaces;

namespace Application.Followers
{
    public class List
    {
     public class Query : IRequest<Result<List<Profiles.Profile>>>{
             public string predicate{get; set;}
             public string UserName{get; set;}
        }

         public class Handler:IRequestHandler<Query,Result<List<Profiles.Profile>>>{
            
             private readonly DataContext _context;
             private readonly IMapper _mapper;
             private readonly IUserAccessor _userAccessor;
             public Handler(DataContext dataContext,IMapper mapper,IUserAccessor userAccessor){
                 _context = dataContext;
                 _mapper = mapper;
                 _userAccessor = userAccessor;
             }

             public async Task<Result<List<Profiles.Profile>>> Handle(Query request,CancellationToken cancellationToken){
                  var profiles = new List<Profiles.Profile>();
                   // List of users that the user is following
                  switch(request.predicate){
                      case "followers":
                          profiles = await _context.UserFollowings
                                           .Where(userfollowing => userfollowing.Target.UserName == request.UserName)
                                           .Select(userfollowing => userfollowing.Observer)
                                           .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider,new {currentUserName = _userAccessor.GetUsername()})
                                           .ToListAsync();
                          break;
                    // List of users that are following the user
                       case "following": 
                          profiles = await _context.UserFollowings
                                           .Where(userfollowing => userfollowing.Observer.UserName == request.UserName)
                                           .Select(userfollowing => userfollowing.Target)
                                           .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider,new {currentUserName = _userAccessor.GetUsername()})
                                           .ToListAsync();
                          break;
                  }
                  return Result<List<Profiles.Profile>>.Success(profiles);
             }
        }
        

    }
}