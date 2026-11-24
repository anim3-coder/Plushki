using System.Globalization;

public class HotelFilter
{
    public string? Sort { get; set; }
    public decimal? PriceMin { get; set; }
    public decimal? PriceMax { get; set; }
    public string? BedType { get; set; }
    public bool PetsAllowed { get; set; }
    public bool FamilyFriendly { get; set; }
    public List<string> Activities { get; set; } = new();
    public List<string> Amenities { get; set; } = new();

    public bool HasAnyCriteria =>
        PriceMin.HasValue || PriceMax.HasValue ||
        !string.IsNullOrEmpty(BedType) ||
        PetsAllowed || FamilyFriendly ||
        Activities.Count > 0 || Amenities.Count > 0;

    public static HotelFilter Parse(IEnumerable<string>? raw)
    {
        var filter = new HotelFilter();
        if (raw is null) return filter;

        foreach (var item in raw)
        {
            if (string.IsNullOrWhiteSpace(item)) continue;

            var idx = item.IndexOf('=');
            if (idx <= 0 || idx == item.Length - 1) continue;

            var key = item[..idx];
            var value = item[(idx + 1)..];

            switch (key)
            {
                case "sort":
                    filter.Sort = value;
                    break;

                case "price_min" when decimal.TryParse(value,
                    NumberStyles.Any, CultureInfo.InvariantCulture, out var pmin):
                    filter.PriceMin = pmin;
                    break;

                case "price_max" when decimal.TryParse(value,
                    NumberStyles.Any, CultureInfo.InvariantCulture, out var pmax):
                    filter.PriceMax = pmax;
                    break;

                case "bed_type":
                    filter.BedType = value;
                    break;

                case "pets_allowed":
                    filter.PetsAllowed = value == "true";
                    break;

                case "family_friendly":
                    filter.FamilyFriendly = value == "true";
                    break;

                default:
                    if (key.StartsWith("activity_", StringComparison.Ordinal) && value == "true")
                    {
                        filter.Activities.Add(key["activity_".Length..]);
                    }
                    else if (key.StartsWith("amenity_", StringComparison.Ordinal) && value == "true")
                    {
                        filter.Amenities.Add(key["amenity_".Length..]);
                    }
                    break;
            }
        }

        return filter;
    }
}