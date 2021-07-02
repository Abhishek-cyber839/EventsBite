using Microsoft.AspNetCore.Mvc;
using Domain;
using Microsoft.AspNetCore.Identity;
using API.DTOs;
using System.Threading.Tasks;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore; // to use async version of method calls
using System.Security.Claims;
using System.Linq;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using Newtonsoft.Json;
using System.Collections.Generic;

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
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;
        public AccountController(UserManager<User> userManager,SignInManager<User> signInManager,TokenService tokenService,
        IConfiguration config){
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _config = config;
            _httpClient = new HttpClient{
                BaseAddress = new System.Uri("https://graph.facebook.com")
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<Userdto>> LogIn(Logindto logindto){
            // Get user object from databse using _userManager
            // FindByEmailAsync(logindto.Email) doesn't do Eagerly Loading for user images.
            var user = await _userManager.Users
            .Include(user => user.Photos).FirstOrDefaultAsync(user => user.Email == logindto.Email);
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
            var user = await _userManager.Users.Include(user => user.Photos)
                                         .FirstOrDefaultAsync(user => user.Email == User.FindFirstValue(ClaimTypes.Email));
            return CreateUserDTO(user);
        }

        [HttpPost("fblogin")]
        public async Task<ActionResult<Userdto>> FacebookLogin(string accessToken){
            var fbverifiedKeys = _config["Facebook:AppId"] + "|" + _config["Facebook:AppSecret"];
            var verifyToken = await _httpClient.GetAsync($"debug_token?input_token={accessToken}&access_token={fbverifiedKeys}");
            if(!verifyToken.IsSuccessStatusCode) return Unauthorized();
            var fburl = $"me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";
            var response = await _httpClient.GetAsync(fburl);
            if(!response.IsSuccessStatusCode) return Unauthorized();
            var content = await response.Content.ReadAsStringAsync();
            var fbinfo = JsonConvert.DeserializeObject<dynamic>(content);
            var username = (string)fbinfo.id;
            var user = await _userManager.Users.Include(user => user.Photos)
                                              .FirstOrDefaultAsync(user => user.UserName == username);
            if(user != null)
               return CreateUserDTO(user);
            user = new User{
                DisplayName = (string)fbinfo.name,
                Email = (string)fbinfo.email,
                UserName = (string)fbinfo.id,
                Photos = new List<Photo>{new Photo{
                    Id = "fb_" + (string)fbinfo.id,
                    Url = (string)fbinfo.picture.data.url,
                    IsMainPhoto = true
                }}
            };
            var result = await _userManager.CreateAsync(user);
            if(!result.Succeeded) return BadRequest("Error creating user with Facebook Credentials:FacebookLogin()");
            return CreateUserDTO(user);
        }

        private Userdto CreateUserDTO(User user){
            return new Userdto{
                    DisplayName = user.DisplayName,
                    Image = user?.Photos?.FirstOrDefault(photo => photo.IsMainPhoto)?.Url,
                    Token = _tokenService.CreateToken(user),
                    UserName = user.UserName
                };
        }
        

    }
}