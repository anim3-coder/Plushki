
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class BookingController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public BookingController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyBookings()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var bookings = await _context.Bookings
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.CheckInDate)
            .ToListAsync();

        // Находим все брони, у которых срок выезда уже прошёл, а статус всё ещё Pending
        var expiredBookings = bookings
            .Where(b => b.CheckOutDate.Date < DateTime.UtcNow.Date && b.Status == BookingStatus.Pending)
            .ToList();

        if (expiredBookings.Any())
        {
            foreach (var booking in expiredBookings)
            {
                booking.Status = BookingStatus.Completed;
            }

            // Сохраняем изменения в базе данных
            await _context.SaveChangesAsync();
        }


        return Ok(bookings);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBooking(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var booking = await _context.Bookings
            //.Include(b => b.Hotel)
            //.Include(b => b.Room)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null)
            return NotFound();

        if (booking.CheckOutDate.Date < DateTime.UtcNow.Date && booking.Status == BookingStatus.Pending)
            booking.Status = BookingStatus.Completed;

        // Проверяем, что пользователь является владельцем бронирования или администратором
        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin && booking.UserId != userId)
            return Forbid();

        return Ok(booking);
    }

    [HttpPost]
    public async Task<IActionResult> CreateBooking([FromBody] BookingDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Проверяем существование отеля и комнаты
            var hotel = await _context.Hotels.FindAsync(dto.HotelId);
            if (hotel == null)
                return BadRequest("Отель не найден");

            var room = await _context.Rooms.FindAsync(dto.RoomId);
            if (room == null || room.HotelId != dto.HotelId)
                return BadRequest("Комната не найдена или не принадлежит указанному отелю");

            // не пересекаются ли даты с существующими бронированиями этой комнаты
            var conflictingBooking = await _context.Bookings
                .AnyAsync(b => b.RoomId == dto.RoomId &&
                               b.Status != BookingStatus.Cancelled &&
                               dto.CheckInDate < b.CheckOutDate &&
                               dto.CheckOutDate > b.CheckInDate);
            if (conflictingBooking)
                return Conflict("Выбранный номер уже забронирован на указанные даты");
             
            // Вычисляем общую стоимость (цены из Room, количество ночей)
            var nights = (dto.CheckOutDate - dto.CheckInDate).Days;
            if (nights <= 0)
                return BadRequest("Дата выезда должна быть позже даты заезда");
            var totalPrice = room.PricePerNight * nights;

            var booking = new Booking
            {
                UserId = userId,
                HotelId = dto.HotelId,
                RoomId = dto.RoomId,
                CheckInDate = dto.CheckInDate,
                CheckOutDate = dto.CheckOutDate,
                TotalPrice = totalPrice,
                Status = BookingStatus.Confirmed,
                Email = dto.Email,
                Phone = dto.Phone,
                FirstName = dto.FirstName,
                LastName = dto.LastName
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
        }
        catch(Exception ex)
        {
            return BadRequest(ex);
        }
    }

    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> CancelBooking(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");
        var booking = await _context.Bookings.FindAsync(id);
        if (booking == null)
            return NotFound();

        if (!isAdmin && booking.UserId != userId)
            return Forbid();

        if (booking.Status == BookingStatus.Cancelled)
            return BadRequest("Бронирование уже отменено");

        booking.Status = BookingStatus.Cancelled;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Бронирование успешно отменено" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBooking(int id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking == null)
            return NotFound();

        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}