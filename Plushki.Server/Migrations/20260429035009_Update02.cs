using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Plushki.Server.Migrations
{
    /// <inheritdoc />
    public partial class Update02 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AmenityCategoryJson",
                table: "Hotels");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Rooms",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<float>(
                name: "Square",
                table: "Rooms",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "Square",
                table: "Rooms");

            migrationBuilder.AddColumn<string>(
                name: "AmenityCategoryJson",
                table: "Hotels",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
