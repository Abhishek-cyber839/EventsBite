using MediatR;
using Domain;
using Application.Core;
using Persistent;
using Application.Interfaces;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Application.Profiles
{
    public class UserDetails
    {
        public class Query : IRequest<Result<Profile>>
        {
            public string Username { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<Profile>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper,IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Profile>> Handle(Query request,CancellationToken cancellationToken)
            {
                var user = await _context.Users
                .ProjectTo<Profile>(_mapper.ConfigurationProvider,new {currentUserName = _userAccessor.GetUsername()})
                .SingleOrDefaultAsync(user => user.UserName == request.Username);
                if(user == null) return null;
                return Result<Profile>.Success(user);
            }
        }
    }
}