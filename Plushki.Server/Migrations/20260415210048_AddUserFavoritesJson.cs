using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Plushki.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddUserFavoritesJson : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FavoritesJson",
                table: "AspNetUsers",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FavoritesJson",
                table: "AspNetUsers");
        }
    }
}
