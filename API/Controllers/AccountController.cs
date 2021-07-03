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
using Microsoft.AspNetCore.Http;
using Infrastructure.Email;
using Microsoft.AspNetCore.WebUtilities;
using System.Text; // Encoding

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
        private readonly EmailSender _emailSender;
        public AccountController(UserManager<User> userManager,SignInManager<User> signInManager,TokenService tokenService,
        IConfiguration config,EmailSender emailSender){
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _config = config;
            _httpClient = new HttpClient{
                BaseAddress = new System.Uri("https://graph.facebook.com")
            };
            _emailSender = emailSender;
        }

        [HttpPost("login")]
        public async Task<ActionResult<Userdto>> LogIn(Logindto logindto){
            // Get user object from databse using _userManager
            // FindByEmailAsync(logindto.Email) doesn't do Eagerly Loading for user images.
            var user = await _userManager.Users
            .Include(user => user.Photos).FirstOrDefaultAsync(user => user.Email == logindto.Email);
            if(user == null)
                return Unauthorized("Invalid Email Address");
            if(user.UserName == "bob") user.EmailConfirmed = true;
            if(!user.EmailConfirmed)
                return Unauthorized("Please confirm your email address");
            // Then SignIn that user using _signInManager.
            var result = await _signInManager.CheckPasswordSignInAsync(user,logindto.Password,false);
            if(result.Succeeded){
                await SetRefreshToken(user);
                return CreateUserDTO(user);
            }
            return Unauthorized("Invalid Password");
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
            if(!result.Succeeded) return BadRequest("Unable to create User");

            var origin = Request.Headers["origin"]; // where we wanna send email to
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(newUser); // genrate token through which user will send back and we will match it to confirm email
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token)); // encode when sending email and decode when user sends back
            var verifyUrl = $"{origin}/account/verify/Email?token={token}&email={newUser.Email}"; // Link on which user will go to confirm their email.
            var message = $"<p>Hello from EventsBite team,please verify your email by clicking on the Link below: </p><p><a href='{verifyUrl}'>Verify My Email</a></p>";
            await _emailSender.SendEmailAsync(newUser.Email,"EventsBite: Email Verification",message);
            return Ok("Registration Successful, Just verify your email with one last step");


            // if(result.Succeeded){
            //     await SetRefreshToken(newUser);
            //     return CreateUserDTO(newUser);
            // }
            // return BadRequest("Unable to create User");
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
            user.EmailConfirmed = true; // users have verified their email address.
            var result = await _userManager.CreateAsync(user);
            if(!result.Succeeded) return BadRequest("Error creating user with Facebook Credentials:FacebookLogin()");
            await SetRefreshToken(user);
            return CreateUserDTO(user);
        }

        public async Task SetRefreshToken(User user){
            var refreshToken = _tokenService.GetRefreshToken();
            user.RefreshTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);
            var cookieOptions = new CookieOptions{ HttpOnly=true,Expires=refreshToken.Expiry };
            Response.Cookies.Append("refreshToken",refreshToken.Token,cookieOptions);

        }

        [Authorize]
        [HttpPost("refresh-token")]
        public async Task<ActionResult<Userdto>> GetNewRefreshToken(){
            var refreshToken = Request.Cookies["refreshToken"];
            var user = await _userManager.Users
            .Include(usr => usr.RefreshTokens)
            .Include(usr => usr.Photos)
            .FirstOrDefaultAsync(usr => usr.UserName == User.FindFirstValue(ClaimTypes.Name));
            var oldToken = user.RefreshTokens.SingleOrDefault(rToken => rToken.Token == refreshToken);
            if(oldToken != null && !oldToken.IsActive) return Unauthorized();
            return CreateUserDTO(user);
        } 

        [HttpPost("verifyEmail")]
        public async Task<IActionResult> VerifyEmail(string token,string email){
            var user = await _userManager.FindByEmailAsync(email);
            if(user == null) return Unauthorized();
            var decodedBytes = WebEncoders.Base64UrlDecode(token);
            var decodedToken = Encoding.UTF8.GetString(decodedBytes);
            var result = await _userManager.ConfirmEmailAsync(user,decodedToken);
            if(!result.Succeeded) return BadRequest("Can not verify your email address");
            return Ok("Email confrimed");
        }

        [HttpGet("resend-email-verification")]
        public async Task<IActionResult> ResendEmailVerification(string email){
            var user = await _userManager.FindByEmailAsync(email);
            if(user == null) return Unauthorized();
            var origin = Request.Headers["origin"]; // where we wanna send email to
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user); // genrate token through which user will send back and we will match it to confirm email
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token)); // encode when sending email and decode when user sends back
            var verifyUrl = $"{origin}/account/verify/Email?token={token}&email={user.Email}"; // Link on which user will go to confirm their email.
            var message = $"<p>Hello from EventsBite team,please verify your email by clicking on the Link below: </p><p><a href='{verifyUrl}'>Verify My Email</a></p>";
            await _emailSender.SendEmailAsync(user.Email,"EventsBite: Email Verification",message);
            return Ok("Just verify your email we've sent you another link");
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