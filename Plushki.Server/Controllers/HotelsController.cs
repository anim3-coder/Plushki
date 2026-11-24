using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

[Route("api/[controller]")]
[ApiController]
public class HotelsController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<HotelsController> _logger;

    public HotelsController(
        UserManager<ApplicationUser> userManager,
        ApplicationDbContext context,
        ILogger<HotelsController> logger)
    {
        _userManager = userManager;
        _context = context;
        _logger = logger;
    }

    [NonAction]
    public async Task UseAuth(Action<ApplicationUser> action)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return;

            // 2. Ищем пользователя в базе
            var user = await _userManager.FindByNameAsync(userId);
            if (user == null)
                return;

            action.Invoke(user);
        }
        catch
        {
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetHotels(
    [FromQuery] string? city,
    [FromQuery] string? country,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] string[]? filters = null)
    {
        try
        {
            var filter = HotelFilter.Parse(filters);

            _logger.LogInformation(
                ">>> GetHotels RAW: city={City}, country={Country}, page={Page}, pageSize={PageSize}, filters=[{RawFilters}]",
                city, country, page, pageSize,
                filters is null ? "null" : string.Join(", ", filters));

            _logger.LogInformation(
                ">>> GetHotels PARSED: sort={Sort}, priceMin={PriceMin}, priceMax={PriceMax}, bedType={BedType}, pets={Pets}, family={Family}, activities=[{Activities}], amenities=[{Amenities}], dataTime={DataTime}",
                filter.Sort, filter.PriceMin, filter.PriceMax, filter.BedType,
                filter.PetsAllowed, filter.FamilyFriendly,
                string.Join(", ", filter.Activities),
                string.Join(", ", filter.Amenities),
                DateTime.Now.ToString("O"));

            var query = _context.Hotels.AsQueryable();

            // --- Город / страна ---
            if (!string.IsNullOrEmpty(city))
                query = query.Where(h => h.City.Contains(city));
            if (!string.IsNullOrEmpty(country))
                query = query.Where(h => h.Country.Contains(country));

            // --- Цена (Room.PricePerNight, mapped) ---
            if (filter.PriceMin.HasValue)
            {
                var min = filter.PriceMin.Value;
                query = query.Where(h =>
                    _context.Rooms.Any(r => r.HotelId == h.Id && r.PricePerNight >= min));
            }
            if (filter.PriceMax.HasValue)
            {
                var max = filter.PriceMax.Value;
                query = query.Where(h =>
                    _context.Rooms.Any(r => r.HotelId == h.Id && r.PricePerNight <= max));
            }

            // --- Тип кровати: Room.AdditionalServicesJson, формат "Название:Количество" ---
            if (!string.IsNullOrEmpty(filter.BedType)
                && filter.BedType != "any"
                && FilterMapping.BedType.TryGetValue(filter.BedType, out var bedToken))
            {
                var ids = await FindHotelIdsByRoomServiceLikeAsync(bedToken + ":%");
                query = query.Where(h => ids.Contains(h.Id));
            }

            // --- pets/family: в Hotel.AdditionalServicesJson ---
            if (filter.PetsAllowed)
            {
                var ids = await FindHotelIdsByHotelServiceAsync("Можно с животными");
                query = query.Where(h => ids.Contains(h.Id));
            }
            if (filter.FamilyFriendly)
            {
                var ids = await FindHotelIdsByHotelServiceAsync("Для всей семьи");
                query = query.Where(h => ids.Contains(h.Id));
            }

            // --- Активности: в Hotel.AdditionalServicesJson ---
            foreach (var key in filter.Activities)
            {
                if (!FilterMapping.HotelAmenity.TryGetValue(key, out var value)) continue;
                var ids = await FindHotelIdsByHotelServiceAsync(value);
                query = query.Where(h => ids.Contains(h.Id));
            }

            // --- Удобства: часть в Hotel, часть в Room ---
            foreach (var key in filter.Amenities)
            {
                if (FilterMapping.HotelAmenity.TryGetValue(key, out var hotelValue))
                {
                    var ids = await FindHotelIdsByHotelServiceAsync(hotelValue);
                    query = query.Where(h => ids.Contains(h.Id));
                }
                else if (FilterMapping.RoomAmenity.TryGetValue(key, out var roomValue))
                {
                    var ids = await FindHotelIdsByRoomServiceAsync(roomValue);
                    query = query.Where(h => ids.Contains(h.Id));
                }
                // неизвестный ключ — молча игнорируем
            }

            // --- Сортировка ---
            query = filter.Sort switch
            {
                "price-asc" => query.OrderBy(h =>
                    _context.Rooms.Where(r => r.HotelId == h.Id)
                                  .Min(r => (decimal?)r.PricePerNight) ?? 0),
                "price-desc" => query.OrderByDescending(h =>
                    _context.Rooms.Where(r => r.HotelId == h.Id)
                                  .Min(r => (decimal?)r.PricePerNight) ?? 0),
                "rating-desc" => query.OrderByDescending(h =>
                    h.Reviews.Any() ? h.Reviews.Average(r => (double)r.Rating) : 0),
                "name-asc" => query.OrderBy(h => h.Name),
                _ => query.OrderBy(h => h.Id),
            };

            var totalCount = await query.CountAsync();

            var hotels = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(h => h.Reviews)
                .ToListAsync();

            // Hotel.Rooms [NotMapped] → Include не работает, догружаем отдельно
            var hotelIds = hotels.Select(h => h.Id).ToList();
            var rooms = await _context.Rooms
                .Where(r => hotelIds.Contains(r.HotelId))
                .ToListAsync();

            foreach (var h in hotels)
                h.Rooms = rooms.Where(r => r.HotelId == h.Id).ToList();

            await UseAuth((User) =>
            {
                for (int i = 0; i < hotels.Count; i++)
                    hotels[i].IsFavorite = User.Favorites.Contains(hotels[i].Id);
            });

            _logger.LogInformation(
                ">>> GetHotels RESULT: totalCount={Total} (city={City}, page={Page})",
                totalCount, city, page);

            return Ok(new { totalCount, page, pageSize, data = hotels });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                ">>> GetHotels ERROR: city={City}, filters=[{RawFilters}], message={Message}",
                city,
                filters is null ? "null" : string.Join(", ", filters),
                ex.Message);
            return BadRequest(ex.Message);
        }
    }

    private async Task<List<int>> FindHotelIdsByHotelServiceAsync(string service)
    {
        return await _context.Database
            .SqlQueryRaw<int>(
                @"SELECT h.Id AS Value FROM Hotels h
              WHERE EXISTS (
                  SELECT 1 FROM json_each(h.AdditionalServicesJson)
                  WHERE value = {0}
              )", service)
            .ToListAsync();
    }

    private async Task<List<int>> FindHotelIdsByRoomServiceAsync(string service)
    {
        return await _context.Database
            .SqlQueryRaw<int>(
                @"SELECT DISTINCT r.HotelId AS Value FROM Rooms r
              WHERE EXISTS (
                  SELECT 1 FROM json_each(r.AdditionalServicesJson)
                  WHERE value = {0}
              )", service)
            .ToListAsync();
    }

    private async Task<List<int>> FindHotelIdsByRoomServiceLikeAsync(string likePattern)
    {
        return await _context.Database
            .SqlQueryRaw<int>(
                @"SELECT DISTINCT r.HotelId AS Value FROM Rooms r
              WHERE EXISTS (
                  SELECT 1 FROM json_each(r.AdditionalServicesJson)
                  WHERE value LIKE {0}
              )", likePattern)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetHotel(int id)
    {
        var hotel = await _context.Hotels
            .Include(h => h.Rooms)
            .Include(h => h.Reviews)
            .FirstOrDefaultAsync(h => h.Id == id);

        if (hotel == null)
            return NotFound("Отель не найден");

        await UseAuth((User) =>
        {
            hotel.IsFavorite = User.Favorites.Contains(hotel.Id);
        });

        return Ok(hotel);
    }

    [HttpPost]
    public async Task<IActionResult> CreateHotel([FromBody] HotelCreateModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var hotel = new Hotel
        {
            Name = model.Name,
            Address = model.Address,
            City = model.City,
            Country = model.Country,
            AdditionalServices = model.AdditionalServices,
            ImagesURL = model.ImagesURL,
        };

        _context.Hotels.Add(hotel);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetHotel), new { id = hotel.Id }, hotel);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHotel(int id, [FromBody] HotelUpdateModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var hotel = await _context.Hotels.FindAsync(id);
        if (hotel == null)
            return NotFound("Отель не найден");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        hotel.Name = model.Name;
        hotel.Address = model.Address;
        hotel.City = model.City;
        hotel.Country = model.Country;
        hotel.AdditionalServices = model.AdditionalServices;
        hotel.ImagesURL = model.ImagesURL;
        hotel.CheckInTime = model.CheckInTime;
        hotel.CheckOutTime = model.CheckOutTime;

        _context.Entry(hotel).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("{hotelId}/reviews")]
    public async Task<IActionResult> GetHotelReviews(
    int hotelId,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
    {
        var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == hotelId);
        if (!hotelExists)
            return NotFound("Отель не найден");

        var query = _context.HotelReviews
            .Where(r => r.HotelId == hotelId)
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt);

        var totalCount = await query.CountAsync();

        var reviews = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new HotelReviewDto
            {
                Id = r.Id,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt,
                UserName = r.User.UserName,
                UserId = r.UserId
            })
            .ToListAsync();

        // --- Сводка: среднее и распределение ---
        var grouped = await _context.HotelReviews
            .Where(r => r.HotelId == hotelId)
            .GroupBy(r => r.Rating)
            .Select(g => new { Rating = g.Key, Count = g.Count() })
            .ToListAsync();

        var distribution = new int[5];   // [1★, 2★, 3★, 4★, 5★]
        foreach (var g in grouped)
            if (g.Rating >= 1 && g.Rating <= 5)
                distribution[g.Rating - 1] = g.Count;

        var total = distribution.Sum();
        var average = total > 0
            ? Enumerable.Range(1, 5).Sum(i => i * distribution[i - 1]) / (double)total
            : 0;

        return Ok(new
        {
            totalCount,
            page,
            pageSize,
            averageRating = Math.Round(average, 1),
            ratingDistribution = distribution,
            data = reviews
        });
    }

    [HttpDelete("reviews/{reviewId}")]
    [Authorize]
    public async Task<IActionResult> DeleteReview(int reviewId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");

        var review = await _context.HotelReviews
            .Include(r => r.Hotel)
            .FirstOrDefaultAsync(r => r.Id == reviewId);

        if (review == null)
            return NotFound();

        if (!isAdmin && review.UserId != userId)
            return Forbid();

        _context.HotelReviews.Remove(review);
        await _context.SaveChangesAsync();
        
        return NoContent();
    }

    [Authorize]
    [HttpGet("reviews/my")]
    public async Task<IActionResult> GetMyReviews()
    {
        // ClaimTypes.NameIdentifier может содержать email (из-за MapInboundClaims),
        // поэтому ищем сначала по Id, потом по UserName
        var claimValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(claimValue))
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(claimValue)
                ?? await _userManager.FindByNameAsync(claimValue);
        if (user == null)
            return Unauthorized(new { message = "Сессия устарела, войдите заново" });

        var reviews = await _context.HotelReviews
            .Where(r => r.UserId == user.Id)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                r.Rating,
                r.Comment,
                r.CreatedAt,
                r.HotelId,
                HotelName = r.Hotel.Name,
                HotelCity = r.Hotel.City,
            })
            .ToListAsync();

        return Ok(reviews);
    }

    [HttpPost("{hotelId}/reviews")]
    [Authorize]
    public async Task<IActionResult> AddHotelReview(int hotelId, [FromBody] HotelReviewCreateModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // 1. Claim может содержать email (из-за маппинга sub → nameidentifier).
        //    Ищем пользователя сначала по Id, потом по UserName.
        var claimValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(claimValue))
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(claimValue)
                ?? await _userManager.FindByNameAsync(claimValue);
        if (user == null)
            return Unauthorized(new { message = "Сессия устарела, войдите заново" });

        // 2. Дальше используем настоящий GUID из БД
        var userId = user.Id;   // 408c8310-23c7-4197-8806-d102438562e5

        var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == hotelId);
        if (!hotelExists)
            return NotFound("Отель не найден");

        var existingReview = await _context.HotelReviews
            .FirstOrDefaultAsync(r => r.HotelId == hotelId && r.UserId == userId);
        if (existingReview != null)
            return Conflict("Вы уже оставили отзыв для этого отеля");

        var review = new HotelReview
        {
            HotelId = hotelId,
            UserId = userId,       // ← GUID, FK пройдёт
            Rating = model.Rating,
            Comment = model.Comment,
            CreatedAt = DateTime.UtcNow,
        };

        _context.HotelReviews.Add(review);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetHotelReviews), new { hotelId },
            new { review.Id, review.Rating, review.Comment, review.CreatedAt });
    }
}

public class HotelReviewCreateModel
{
    [Range(1, 5)]
    public int Rating { get; set; }
    [MaxLength(1000)]
    public string? Comment { get; set; }
}

public class HotelReviewDto
{
    public int Id { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? UserName { get; set; }
    public string UserId { get; set; } = string.Empty;
}

public class HotelCreateModel
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public List<string> AdditionalServices { get; set; } = new();
    public List<string> ImagesURL { get; set; } = new();
}

public class HotelUpdateModel
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string CheckInTime { get; set; } = "14:00";
    public string CheckOutTime { get; set; } = "12:00";
    public List<string> AdditionalServices { get; set; } = new();
    public List<string> ImagesURL { get; set; } = new();
}