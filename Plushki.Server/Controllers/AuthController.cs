using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ApplicationDbContext context,
        IConfiguration configuration,
        ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _context = context;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            return Ok(new { message = "User registered successfully" });
        }

        return BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var User = await _userManager.FindByEmailAsync(model.Email);
        if (User == null)
            return Unauthorized(new { message = "Invalid credentials" });

        var result = await _signInManager.PasswordSignInAsync(User, model.Password, false, false);
        if (!result.Succeeded)
            return Unauthorized(new { message = "Invalid credentials" });

        var token = GenerateJwtToken(User);

        var user = new
        {
            id = User.Id,
            userName = User.UserName,
            email = User.Email,
            firstName = User.FirstName,
            lastName = User.LastName,
            phone = User.PhoneNumber
        };

        return Ok(new { token, user });
    }

    [Authorize]
    [HttpGet("favorite")]
    public async Task<IActionResult> GetFavorite()
    {
        // 1. Получаем идентификатор из токена
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "Invalid token: missing user identifier" });

        // 2. Ищем пользователя в базе
        var user = await _userManager.FindByNameAsync(userId);
        if (user == null)
            return BadRequest("User not found");

        List<Hotel> hotels = await _context.Hotels
            .Include(h => h.Rooms)
            .Where(h => user.Favorites.Contains(h.Id))
            .ToListAsync();

        foreach(Hotel h in hotels)
        {
            h.IsFavorite = true;
        }

        return Ok(hotels);
    }

    [Authorize]
    [HttpPost("favorite")]
    public async Task<IActionResult> SetFavorite([FromBody] SetFavoriteBody favoriteBody)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "Invalid token: missing user identifier" });

        var user = await _userManager.FindByNameAsync(userId);
        if (user == null)
            return BadRequest("User not found");
        var list = user.Favorites;
        if (favoriteBody.type)
        {
            if (list.Contains(favoriteBody.hotelID) == false)
                list.Add(favoriteBody.hotelID);
        }
        else
        {
            if (list.Contains(favoriteBody.hotelID))
                list.Remove(favoriteBody.hotelID);
        }
        user.Favorites = list;
        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            return BadRequest(new { errors = updateResult.Errors });

        return Ok(new { favoriteBody.hotelID, favoriteBody.type, user.Favorites});
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Invalid token: missing user identifier" });

            // 2. Ищем пользователя в базе
            var user = await _userManager.FindByNameAsync(userId);
            if (user == null)
                return BadRequest("User not found");

            // 3. Возвращаем безопасные данные
            return Ok(new
            {
                id = user.Id,
                userName = user.UserName,
                email = user.Email,
                firstName = user.FirstName,
                lastName = user.LastName,
                phone = user.PhoneNumber,
                favorites = user.Favorites,
            });
        }
        catch(Exception ex)
        {
            return BadRequest(ex);
        }
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateUser([FromBody] UpdateUserModel model)
    {
        // 1. Получаем текущего пользователя из токена
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { message = "Invalid token: missing user identifier" });

        var user = await _userManager.FindByNameAsync(userId);
        if (user == null)
            return NotFound(new { message = "User not found" });

        // 2. Обновляем базовые поля, если они переданы
        if (!string.IsNullOrWhiteSpace(model.FirstName))
            user.FirstName = model.FirstName;

        if (!string.IsNullOrWhiteSpace(model.LastName))
            user.LastName = model.LastName;

        if (!string.IsNullOrWhiteSpace(model.Phone))
            user.PhoneNumber = model.Phone; // Стандартное поле Identity

        // Email меняем отдельно, так как это UserName
        if (!string.IsNullOrWhiteSpace(model.Email) && model.Email != user.Email)
        {
            var emailExists = await _userManager.FindByEmailAsync(model.Email);
            if (emailExists != null && emailExists.Id != user.Id)
                return BadRequest(new { message = "Email already in use" });

            user.Email = model.Email;
            user.UserName = model.Email;
            user.NormalizedEmail = model.Email.ToUpperInvariant();
            user.NormalizedUserName = model.Email.ToUpperInvariant();
        }

        // 3. Сохраняем изменения обычных полей
        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            return BadRequest(new { errors = updateResult.Errors });

        // 4. Смена пароля, если переданы оба поля
        if (!string.IsNullOrWhiteSpace(model.CurrentPassword) &&
            !string.IsNullOrWhiteSpace(model.NewPassword))
        {
            var passwordChangeResult = await _userManager.ChangePasswordAsync(
                user,
                model.CurrentPassword,
                model.NewPassword
            );

            if (!passwordChangeResult.Succeeded)
                return BadRequest(new { errors = passwordChangeResult.Errors });
        }

        return Ok(new
        {
            id = user.Id,
            userName = user.UserName,
            email = user.Email,
            firstName = user.FirstName,
            lastName = user.LastName,
            phone = user.PhoneNumber
        });
    }

    private string GenerateJwtToken(ApplicationUser user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpiresInMinutes"]));

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class SetFavoriteBody
{
    public int hotelID { get; set; } = 0;
    public bool type { get; set; } = false;
}