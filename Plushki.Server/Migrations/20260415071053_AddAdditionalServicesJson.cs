using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Plushki.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddAdditionalServicesJson : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdditionalServicesJson",
                table: "Rooms",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AdditionalServicesJson",
                table: "Hotels",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdditionalServicesJson",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "AdditionalServicesJson",
                table: "Hotels");
        }
    }
}
