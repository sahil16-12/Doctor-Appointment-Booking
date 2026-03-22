using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPatientLocationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "latitude",
                table: "patients",
                type: "decimal(10,8)",
                nullable: true,
                comment: "Patient latitude coordinate for location-based doctor search");

            migrationBuilder.AddColumn<decimal>(
                name: "longitude",
                table: "patients",
                type: "decimal(11,8)",
                nullable: true,
                comment: "Patient longitude coordinate for location-based doctor search");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "latitude",
                table: "patients");

            migrationBuilder.DropColumn(
                name: "longitude",
                table: "patients");
        }
    }
}
