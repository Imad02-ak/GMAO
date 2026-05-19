using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GMAO.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOrganeModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Organes_SousEnsembles_SousEnsembleId",
                table: "Organes");

            migrationBuilder.AlterColumn<string>(
                name: "SousEnsembleId",
                table: "Organes",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateInstallation",
                table: "Organes",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateRemplacement",
                table: "Organes",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionTechnique",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DocumentsJson",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DureeVie",
                table: "Organes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DureeVieUnite",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EquipementCode",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EquipementId",
                table: "Organes",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EquipementNom",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FamilleId",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FamilleNom",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Fournisseur",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GroupeId",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GroupeNom",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Marque",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PeriodeGarantie",
                table: "Organes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PeriodeGarantieUnite",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Photo",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PositionSurEquipement",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PrixUnitaire",
                table: "Organes",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Reference",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SousFamilleId",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SousFamilleNom",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Statut",
                table: "Organes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Organes_EquipementId",
                table: "Organes",
                column: "EquipementId");

            migrationBuilder.AddForeignKey(
                name: "FK_Organes_Equipements_EquipementId",
                table: "Organes",
                column: "EquipementId",
                principalTable: "Equipements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Organes_SousEnsembles_SousEnsembleId",
                table: "Organes",
                column: "SousEnsembleId",
                principalTable: "SousEnsembles",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Organes_Equipements_EquipementId",
                table: "Organes");

            migrationBuilder.DropForeignKey(
                name: "FK_Organes_SousEnsembles_SousEnsembleId",
                table: "Organes");

            migrationBuilder.DropIndex(
                name: "IX_Organes_EquipementId",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "DateInstallation",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "DateRemplacement",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "DescriptionTechnique",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "DocumentsJson",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "DureeVie",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "DureeVieUnite",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "EquipementCode",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "EquipementId",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "EquipementNom",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "FamilleId",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "FamilleNom",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "Fournisseur",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "GroupeId",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "GroupeNom",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "Marque",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "PeriodeGarantie",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "PeriodeGarantieUnite",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "Photo",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "PositionSurEquipement",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "PrixUnitaire",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "Reference",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "SousFamilleId",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "SousFamilleNom",
                table: "Organes");

            migrationBuilder.DropColumn(
                name: "Statut",
                table: "Organes");

            migrationBuilder.AlterColumn<string>(
                name: "SousEnsembleId",
                table: "Organes",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Organes_SousEnsembles_SousEnsembleId",
                table: "Organes",
                column: "SousEnsembleId",
                principalTable: "SousEnsembles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
