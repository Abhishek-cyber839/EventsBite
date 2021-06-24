using Microsoft.AspNetCore.Mvc;
using Domain;
using Microsoft.AspNetCore.Identity;
using API.DTOs;
using System.Threading.Tasks;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore; // to use async version of method calls
using System.Security.Claims;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("/api/[controller]")]
    public class AccountController : ControllerBase
    {

        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly TokenService _tokenService;
        public AccountController(UserManager<User> userManager,SignInManager<User> signInManager,TokenService tokenService){
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<Userdto>> LogIn(Logindto logindto){
            // Get user object from databse using _userManager
            var user = await _userManager.FindByEmailAsync(logindto.Email);
            if(user == null)
                return Unauthorized();
            // Then SignIn that user using _signInManager.
            var result = await _signInManager.CheckPasswordSignInAsync(user,logindto.Password,false);
            if(result.Succeeded)
                return CreateUserDTO(user);
            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<ActionResult<Userdto>> Register(Registerdto registerdto){
            if(await _userManager.Users.AnyAsync(x => x.Email == registerdto.Email))
            {
                ModelState.AddModelError("email","Email has already been taken");
                return ValidationProblem(ModelState);
            }
            if(await _userManager.Users.AnyAsync(x => x.UserName == registerdto.UserName))
            {
                ModelState.AddModelError("username","Username has already been taken");
                return ValidationProblem(ModelState);
            }
            var newUser = new User{
                Email = registerdto.Email,
                DisplayName = registerdto.DisplayName,
                UserName = registerdto.UserName
            };
            var result = await _userManager.CreateAsync(newUser,registerdto.Password);
            if(result.Succeeded)
                return CreateUserDTO(newUser);
            return BadRequest("Unable to create User");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<Userdto>> GetCurrentUser(){
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            return CreateUserDTO(user);
        }

        private Userdto CreateUserDTO(User user){
            return new Userdto{
                    DisplayName = user.DisplayName,
                    Image = null,
                    Token = _tokenService.CreateToken(user),
                    UserName = user.UserName
                };
        }
        
    }
}