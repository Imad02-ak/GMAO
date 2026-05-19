using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GMAO.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEquipementFormFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DateAchat",
                table: "Equipements",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateMiseEnService",
                table: "Equipements",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DocumentsJson",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FamilleId",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Fournisseur",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GroupeId",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NumeroSerie",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PeriodeGarantie",
                table: "Equipements",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PeriodeGarantieUnite",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Photo",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PrixAchat",
                table: "Equipements",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SousFamilleId",
                table: "Equipements",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateAchat",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "DateMiseEnService",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "DocumentsJson",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "FamilleId",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "Fournisseur",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "GroupeId",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "NumeroSerie",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "PeriodeGarantie",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "PeriodeGarantieUnite",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "Photo",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "PrixAchat",
                table: "Equipements");

            migrationBuilder.DropColumn(
                name: "SousFamilleId",
                table: "Equipements");
        }
    }
}
