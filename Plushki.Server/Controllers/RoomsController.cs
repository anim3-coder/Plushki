using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/hotels/{hotelId}/[controller]")]
[ApiController]
public class RoomsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<RoomsController> _logger;

    public RoomsController(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        ILogger<RoomsController> logger)
    {
        _context = context;
        _userManager = userManager;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetRooms(int hotelId)
    {
        var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == hotelId);
        if (!hotelExists)
            return NotFound("Отель не найден");

        var rooms = await _context.Rooms
            .Where(r => r.HotelId == hotelId)
            .ToListAsync();

        return Ok(rooms);
    }

    [HttpGet("{roomId}")]
    public async Task<IActionResult> GetRoom(int hotelId, int roomId)
    {
        var room = await _context.Rooms
            .Include(r => r.Hotel)
            .FirstOrDefaultAsync(r => r.HotelId == hotelId && r.Id == roomId);

        return Ok(room);
    }

    [HttpPost]
    public async Task<IActionResult> CreateRoom(int hotelId, [FromBody] RoomCreateModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var hotel = await _context.Hotels.FindAsync(hotelId);
        if (hotel == null)
            return NotFound("Отель не найден");

        var room = new Room
        {
            RoomNumber = model.RoomNumber,
            PricePerNight = model.PricePerNight,
            AdditionalServices = model.AdditionalServices,
            HotelId = hotelId,
            ImagesURL = model.ImageURL ?? new List<string>(),
        };

        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRoom), new { hotelId, roomId = room.Id }, room);
    }

    [HttpPut("{roomId}")]
    public async Task<IActionResult> UpdateRoom(int hotelId, int roomId, [FromBody] RoomUpdateModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var room = await _context.Rooms
            .Include(r => r.Hotel)
            .FirstOrDefaultAsync(r => r.HotelId == hotelId && r.Id == roomId);

        if (room == null)
            return NotFound("Номер не найден");

        room.PricePerNight = model.PricePerNight;
        room.AdditionalServices = model.AdditionalServices;
        room.ImagesURL = model.ImageURL;

        _context.Entry(room).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{roomId}")]
    public async Task<IActionResult> DeleteRoom(int hotelId, int roomId)
    {
        var room = await _context.Rooms
            .Include(r => r.Hotel)
            .FirstOrDefaultAsync(r => r.HotelId == hotelId && r.Id == roomId);

        if (room == null)
            return NotFound("Номер не найден");

        _context.Rooms.Remove(room);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class RoomCreateModel
{
    public string RoomNumber { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public int Capacity { get; set; }
    public List<string> AdditionalServices { get; set; } = new();
    public List<string> ImageURL { get; set; } = new();   // ← добавили
}

public class RoomUpdateModel
{
    public decimal PricePerNight { get; set; }
    public List<string> AdditionalServices { get; set; } = new();
    public List<string> ImageURL { get; set; } = new();
}