using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System.Text.Json;
public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Hotel> Hotels { get; set; }
    public DbSet<Room> Rooms { get; set; }
    public DbSet<HotelReview> HotelReviews { get; set; }
    public DbSet<Booking> Bookings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // ============================================================
        // SQLite не поддерживает decimal в агрегатах (Min, Max, Sum, Average).
        // Храним цены как REAL (double), в C#-коде оставляем decimal.
        // Точность ограничена ~15-17 значащими цифрами — для цен это ок.
        // ============================================================
        builder.Entity<Room>()
            .Property(r => r.PricePerNight)
            .HasConversion<double>();

        builder.Entity<Booking>()
            .Property(b => b.TotalPrice)
            .HasConversion<double>();

        // ============================================================
        // Связи
        // ============================================================
        builder.Entity<Room>()
            .HasOne(r => r.Hotel)            // У номера есть один отель
            .WithMany(h => h.Rooms)           // У отеля много номеров
            .HasForeignKey(r => r.HotelId)    // Внешний ключ в Room
            .OnDelete(DeleteBehavior.Cascade);// При удалении отеля удаляются его номера

        // Связь Hotel -> Reviews (каскадное удаление обычно оставляем)
        builder.Entity<Hotel>()
            .HasMany(h => h.Reviews)
            .WithOne(r => r.Hotel)
            .HasForeignKey(r => r.HotelId)
            .OnDelete(DeleteBehavior.Cascade);

        // Связь User -> Reviews
        builder.Entity<HotelReview>()
            .HasOne(r => r.User)
            .WithMany() // предположим, у ApplicationUser нет коллекции Reviews
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict); // Запрещаем удаление пользователя, если есть отзывы

        // Уникальность: один пользователь может оставить только один отзыв на отель
        builder.Entity<HotelReview>()
            .HasIndex(r => new { r.HotelId, r.UserId })
            .IsUnique();
    }
}

/*
 * dotnet ef migrations add AddUserFavoritesJson
 * dotnet ef database update
 */

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime? BirthDate { get; set; }
    [JsonIgnore]
    public string FavoritesJson { get; private set; } = "[]";
    [NotMapped]
    public List<int> Favorites
    {
        get => JsonSerializer.Deserialize<List<int>>(FavoritesJson) ?? new List<int>();
        set => FavoritesJson = JsonSerializer.Serialize(value ?? new List<int>());
    }
}