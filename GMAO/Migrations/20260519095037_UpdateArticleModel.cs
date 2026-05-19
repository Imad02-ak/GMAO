using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GMAO.Migrations
{
    /// <inheritdoc />
    public partial class UpdateArticleModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SousEnsembles_Equipements_EquipementId",
                table: "SousEnsembles");

            migrationBuilder.AlterColumn<string>(
                name: "EquipementId",
                table: "SousEnsembles",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateDernierMouvement",
                table: "SousEnsembles",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateInventaire",
                table: "SousEnsembles",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Designation",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DocumentsJson",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmplacementStock",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EntrepriseId",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FamilleId",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FamilleNom",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Fournisseur",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GroupeId",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GroupeNom",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Marque",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OrganeLinksJson",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Photo",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PrixUnitaire",
                table: "SousEnsembles",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "QteReapprovisionnement",
                table: "SousEnsembles",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReferenceFabricant",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReferenceInterne",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SousFamilleId",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SousFamilleNom",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "StockActuel",
                table: "SousEnsembles",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "StockCritique",
                table: "SousEnsembles",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "StockMinimum",
                table: "SousEnsembles",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UniteMesure",
                table: "SousEnsembles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ValeurTotale",
                table: "SousEnsembles",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SousEnsembles_Equipements_EquipementId",
                table: "SousEnsembles",
                column: "EquipementId",
                principalTable: "Equipements",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SousEnsembles_Equipements_EquipementId",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "DateDernierMouvement",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "DateInventaire",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "Designation",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "DocumentsJson",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "EmplacementStock",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "EntrepriseId",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "FamilleId",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "FamilleNom",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "Fournisseur",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "GroupeId",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "GroupeNom",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "Marque",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "OrganeLinksJson",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "Photo",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "PrixUnitaire",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "QteReapprovisionnement",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "ReferenceFabricant",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "ReferenceInterne",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "SousFamilleId",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "SousFamilleNom",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "StockActuel",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "StockCritique",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "StockMinimum",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "UniteMesure",
                table: "SousEnsembles");

            migrationBuilder.DropColumn(
                name: "ValeurTotale",
                table: "SousEnsembles");

            migrationBuilder.AlterColumn<string>(
                name: "EquipementId",
                table: "SousEnsembles",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SousEnsembles_Equipements_EquipementId",
                table: "SousEnsembles",
                column: "EquipementId",
                principalTable: "Equipements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
