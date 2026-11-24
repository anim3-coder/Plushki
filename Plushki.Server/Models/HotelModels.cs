using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Linq;

public class Hotel
{
    public int Id { get; set; } = 0;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string CheckInTime { get; set; } = "14:00";
    public string CheckOutTime { get; set; } = "12:00";
    public ICollection<HotelReview> Reviews { get; set; } = new List<HotelReview>();
    public decimal price
    {
        get
        {
            if (Rooms == null || Rooms.Count == 0)
                return 0;

            return Rooms.Min(room => room.PricePerNight);
        }
    }
    [NotMapped]
    public bool IsFavorite { get; set; }
    [NotMapped]
    public double Rating => Reviews?.Any() == true
        ? Reviews.Average(r => r.Rating)
        : 0;
    [JsonIgnore]
    public string ImagesURLJson { get; private set; } = "[]";
    [NotMapped]
    public ICollection<string> ImagesURL
    {
        get
        {
            return JsonSerializer.Deserialize<List<string>>(ImagesURLJson) ?? new List<string>();
        }
        set => ImagesURLJson = JsonSerializer.Serialize(value ?? new List<string>());
    }
    [NotMapped]
    public ICollection<Room> Rooms { get; set; } = new List<Room>();
    [NotMapped]
    public ICollection<Amenity> AmenityCategory
    {
        get
        {
            return Converter.ConvertFrom(AdditionalServices);
        }
    }
    [JsonIgnore]
    public string AdditionalServicesJson { get; private set; } = "[]";
    [NotMapped]
    public ICollection<string> AdditionalServices
    {
        get => JsonSerializer.Deserialize<List<string>>(AdditionalServicesJson) ?? new List<string>();
        set => AdditionalServicesJson = JsonSerializer.Serialize(value ?? new List<string>());
    }
}

public static class FilterMapping
{
    // Всё, что лежит в Hotel.AdditionalServicesJson
    public static readonly IReadOnlyDictionary<string, string> HotelAmenity = new Dictionary<string, string>
    {
        // Интернет
        ["wifiFreeRoom"] = "Бесплатный Wi-Fi в номере",
        ["wifiPaidRoom"] = "Платный Wi-Fi в номере",
        ["wifiFreeArea"] = "Бесплатный Wi-Fi на всей территории",
        ["wifiPaidArea"] = "Платный Wi-Fi на всей территории",
        // Парковка
        ["parkingFree"] = "Бесплатная парковка",
        ["parkingPaid"] = "Платная парковка",
        ["parkingDisabled"] = "Парковка для людей с инвалидностью",
        // Питание
        ["restaurantBar"] = "Ресторан",
        ["fullBoard"] = "Полный пансион",
        ["halfBoard"] = "полупансион",
        ["breakfast"] = "Завтрак",
        ["buffet"] = "Шведский стол",
        // Уборка
        ["dailyCleaning"] = "Ежедневная уборка номера",
        ["weeklyCleaning"] = "Уборка по запросу",
        // Активности (приходят как activity_*, но лежат в Hotel)
        ["restaurant"] = "Ресторан",
        ["cafe"] = "Кафе",
        ["pool"] = "Бассейн",
        ["sauna"] = "Сауна",
        ["spa"] = "SPA",
        ["fitness"] = "Тренажёрный зал",
        ["beach"] = "Собственный пляж",
        ["waterpark"] = "Аквапарк",
        ["playroom"] = "Игровая комната",
        // Особенности размещения (лежат в Hotel, в категории "Услуги")
        ["petsAllowed"] = "Можно с животными",
        ["familyFriendly"] = "Для всей семьи",
    };

    // Всё, что лежит в Room.AdditionalServicesJson
    public static readonly IReadOnlyDictionary<string, string> RoomAmenity = new Dictionary<string, string>
    {
        ["ac"] = "Кондиционер",
        ["tv"] = "Телевизор",
        ["fridge"] = "Холодильник",
        ["teaCoffee"] = "Чай/кофе",
        ["safe"] = "Сейф",
        ["hairdryer"] = "Фен",
        ["iron"] = "Утюг",
        ["bathroom"] = "Санузел",
        ["fan"] = "Вентилятор",
        ["washingMachine"] = "Стиральная машина",
        ["crib"] = "Кроватка для детей",
    };

    // bed_type → подстрока в Room.AdditionalServicesJson (формат "Название:Количество")
    public static readonly IReadOnlyDictionary<string, string> BedType = new Dictionary<string, string>
    {
        ["single"] = "Односпальная кровать",
        ["double"] = "Двуспальная кровать",
        ["king"] = "Двуспальная кровать",
    };
}

public static class Converter
{
    public static readonly AmenityData[] data = new AmenityData[] {
        new AmenityData {
                    Icon = "fas fa-wifi",
                    Type = "Fas",
                    Name = "Интернет"
            },
        new AmenityData {
                    Icon = "fas fa-parking",
                    Type = "Fas",
                    Name = "Парковка"
            },
        new AmenityData {
                    Icon = "fas fa-utensils",
                    Type = "Fas",
                    Name = "Питание"
            },
        new AmenityData {
                    Icon = "fas fa-concierge-bell",
                    Type = "Fas",
                    Name = "Услуги"
            },
        new AmenityData {
                    Icon = "fas fa-broom",
                    Type = "Fas",
                    Name = "Уборка"
            },
        new AmenityData {
                    Icon = "fas fa-person-swimming",
                    Type = "Fas",
                    Name = "Занятия в отеле"
            }
        };

    public static readonly Dictionary<string, string[]> NamePairsAmenity = new()
    {
        ["Интернет"] = new string[]
        {
            "Бесплатный Wi-Fi в номере",
            "Бесплатный Wi-Fi на всей территории",
            "Платный Wi-Fi в номере",
            "Платный Wi-Fi на всей территории",
        },
        ["Парковка"] = new string[]
        {
            "Платная парковка",
            "Бесплатная парковка",
            "Парковка для людей с инвалидностью",
            "Подземная парковка"
        },
        ["Питание"] = new string[]
        {
            "Ресторан",
            "Бар",
            "Ресторан",
            "Полный пансион",
            "полупансион",
            "Кафе",
            "Шведский стол",
            "Завтрак"
        },
        ["Услуги"] = new string[]
        {
            "Круглосуточный фронт-деск",
            "Консьерж",
            "Ускоренная регистрация",
            "Экскурсионное бюро",
            "Можно с животными",
            "Для всей семьи"
        },
        ["Уборка"] = new string[]
        {
            "Ежедневная уборка номера",
            "Уборка по запросу",
            "Генеральная уборка",
            "Химчистка",
            "Смена постельного белья"
        },
        ["Занятия в отеле"] = new string[]
        {
            "Тренажёрный зал",
            "Бассейн",
            "SPA",
            "Игровая комната",
            "Аквапарк",
            "Собственный пляж",
            "Сауна"
        },
        ["Оплата"] = new[] { "Наличными", "Картой", "СБП" },
    };

    static string Normalize(string s) => string.Concat(s?.Where(c => !char.IsWhiteSpace(c)) ?? "").ToUpperInvariant();

    public static ICollection<Amenity> ConvertFrom(ICollection<string> AdditionalServices)
    {
        var serviceToCategory = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        foreach (var kvp in NamePairsAmenity)
        {
            string category = kvp.Key;
            foreach (var service in kvp.Value)
            {
                if (!serviceToCategory.ContainsKey(service))
                    serviceToCategory[service] = category;
            }
        }

        var normalizedLookup = serviceToCategory
            .ToDictionary(
                kvp => Normalize(kvp.Key),
                kvp => kvp.Value
            );

        var comparer = new IgnoreCaseAndWhitespaceComparer();

        var grouped = AdditionalServices
            .Where(s => normalizedLookup.ContainsKey(Normalize(s)))
            .GroupBy(s => normalizedLookup[Normalize(s)])            
            .Select(g => new
            {
                Category = g.Key,
                Services = g.Distinct(comparer).ToArray()            
            });

        var result = new List<Amenity>();
        foreach (var group in grouped)
        {
            var amenityInfo = data.FirstOrDefault(d =>
                d.Name.Equals(group.Category, StringComparison.OrdinalIgnoreCase));
            string icon = amenityInfo.Icon ?? string.Empty;
            string type = amenityInfo.Type ?? string.Empty;

            result.Add(new Amenity
            {
                Icon = icon,
                Name = group.Category,
                Type = type,
                data = group.Services
            });
        }

        return result;
    }

    public static readonly BedType[] BedTypes = new BedType[]
    {
        new BedType()
        {
            name = "Односпальная кровать", capacity = 1,
        },
        new BedType()
        {
            name = "Двуспальная кровать", capacity = 2,
        },
        new BedType()
        {
            name = "Диван-кровать", capacity = 1
        }
    };

    public static ICollection<(int, int, string)> GetBedTypes(ICollection<string> AdditionalServices)
    {
        if (AdditionalServices == null)
            return new List<(int, int, string)>();

        var bedTypeMap = new Dictionary<string, (string OriginalName, int Capacity)>(StringComparer.OrdinalIgnoreCase);
        foreach (var bt in BedTypes)
        {
            if (!string.IsNullOrEmpty(bt.name))
            {
                bedTypeMap[bt.name.ToLowerInvariant()] = (bt.name, bt.capacity);
            }
        }

        var result = new List<(int, int, string)>();

        foreach (var service in AdditionalServices)
        {
            if (string.IsNullOrWhiteSpace(service))
                continue;

            string[] parts = service.Split(':');
            if (parts.Length != 2)
                continue;

            string namePart = parts[0].Trim();
            string countPart = parts[1].Trim();

            if (!int.TryParse(countPart, out int count) || count <= 0)
                continue;

            string key = namePart.ToLowerInvariant();
            if (bedTypeMap.TryGetValue(key, out var bedInfo))
            {
                int totalCapacity = count * bedInfo.Capacity;
                result.Add((totalCapacity, bedInfo.Capacity, bedInfo.OriginalName));
            }
        }

        return result;
    }

    public static readonly string[] RoomsType = new string[]
    {
        "Спальня", "Душ", "Кухня"
    };

    public static ICollection<(int, string)> GetRoomsType(ICollection<string> AdditionalServices)
    {
        // Возвращаем пустую коллекцию, если вход равен null
        if (AdditionalServices == null)
            return new List<(int, string)>();

        // Строим словарь для быстрого поиска:
        // ключ — имя комнаты в нижнем регистре,
        // значение — оригинальное написание из массива RoomsType
        var roomMap = new Dictionary<string, string>();
        foreach (var room in RoomsType)
        {
            if (!string.IsNullOrEmpty(room))
            {
                string lower = room.ToLowerInvariant();
                if (!roomMap.ContainsKey(lower))
                    roomMap[lower] = room;
            }
        }

        var result = new List<(int, string)>();

        foreach (var service in AdditionalServices)
        {
            // Пропускаем пустые или null-строки
            if (string.IsNullOrWhiteSpace(service))
                continue;

            // Ожидаемый формат: "НазваниеКомнаты:Количество"
            string[] parts = service.Split(':');
            if (parts.Length != 2)
                continue;

            string namePart = parts[0].Trim();
            string countPart = parts[1].Trim();

            // Количество должно быть положительным целым числом
            if (!int.TryParse(countPart, out int count) || count <= 0)
                continue;

            string key = namePart.ToLowerInvariant();
            if (roomMap.TryGetValue(key, out string originalName))
            {
                // Добавляем найденную комнату
                result.Add((count, originalName));
            }
            // Если тип комнаты отсутствует в RoomsType — игнорируем
        }

        return result;
    }

    public struct AmenityData
    {
        public string Icon;
        public string Type;
        public string Name;
    }

    public struct BedType
    {
        public string name;
        public int capacity;
    }

    public class IgnoreCaseAndWhitespaceComparer : IEqualityComparer<string>
    {
        public bool Equals(string x, string y) =>
            Normalize(x) == Normalize(y);

        public int GetHashCode(string obj) =>
            Normalize(obj)?.GetHashCode() ?? 0;

        private static string Normalize(string s) =>
            string.Concat(s?.Where(c => !char.IsWhiteSpace(c)) ?? "").ToUpperInvariant();
    }
}

public class Amenity
{
    public string Icon { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string[] data { get; set; } = new string[0]; 
}

public class Room
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public float Square { get; set; } = 0;
    public string RoomNumber { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public int Capacity
    {
        get
        {
            var b = BedTypes;
            int c = 0;
            foreach(var s in b)
            {
                c += s.Item1;
            }
            return c;
        }
    }
    [NotMapped]
    public string BedType
    {
        get
        {
            var b = BedTypes;
            string d = "";
            foreach (var s in b)
            {
                d += $"{s.Item1 / s.Item2} × {s.Item3}\n";
            }
            return d;
        }
    }
    [JsonIgnore]
    [NotMapped]
    public ICollection<(int, int, string)> BedTypes
    {
        get
        {
            return Converter.GetBedTypes(AdditionalServices);
        }
    }

    public int HotelId { get; set; }
    [JsonIgnore]
    public Hotel Hotel { get; set; } = null!;
    [JsonIgnore]
    public string ImagesURLJson { get; private set; } = "[]";
    [NotMapped]
    public List<string> ImagesURL
    {
        get => JsonSerializer.Deserialize<List<string>>(ImagesURLJson) ?? new List<string>();
        set => ImagesURLJson = JsonSerializer.Serialize(value ?? new List<string>());
    }
    [JsonIgnore]
    public string AdditionalServicesJson { get; private set; } = "[]";
    [NotMapped]
    public List<string> AdditionalServices
    {
        get => JsonSerializer.Deserialize<List<string>>(AdditionalServicesJson) ?? new List<string>();
        set => AdditionalServicesJson = JsonSerializer.Serialize(value ?? new List<string>());
    }
}

public class HotelReview
{
    public int Id { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
    public int HotelId { get; set; }
    [JsonIgnore]
    public Hotel Hotel { get; set; } = null!;
}

public class Booking
{
    public int Id { get; set; }
    public BookingStatus Status { get;set; }
    [JsonIgnore]
    public string? UserId { get; set; }
    public int HotelId { get; set; }
    public int RoomId { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public decimal TotalPrice { get; set; }
}

public enum BookingStatus
{
    Pending,
    Confirmed,
    Cancelled,
    Completed
}

public class BookingDto
{
    public int HotelId { get; set; }
    public int RoomId { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public decimal TotalPrice { get; set; }
}
