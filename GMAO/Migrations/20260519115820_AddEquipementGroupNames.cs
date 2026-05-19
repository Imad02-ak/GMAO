using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GMAO.Migrations
{
    /// <inheritdoc />
    public partial class AddEquipementGroupNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FamilleNom",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GroupeNom",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SousFamilleNom",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FamilleNom",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "GroupeNom",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "SousFamilleNom",
                table: "Equipements");
        }
    }
}
