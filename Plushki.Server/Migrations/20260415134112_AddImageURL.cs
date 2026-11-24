using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Plushki.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddImageURL : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImagesURLJson",
                table: "Rooms",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImagesURLJson",
                table: "Hotels",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagesURLJson",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "ImagesURLJson",
                table: "Hotels");
        }
    }
}
