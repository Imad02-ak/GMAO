using System.Text.Json;
using GMAO.Data;
using GMAO.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services
    .AddRazorPages()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });
builder.Services.AddDbContext<GmaoDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("GmaoConnection")));
builder.Services.AddScoped<IOrganisationService, OrganisationService>();
builder.Services.AddScoped<IEquipementService, EquipementService>();
builder.Services.AddScoped<IStockService, StockService>();
builder.Services
    .AddAuthentication(Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Auth/Login";
        options.AccessDeniedPath = "/Auth/Login";
        options.Cookie.Name = "GMAO.Auth";
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
GmaoDbSeeder.Seed(app.Services);

app.UseAuthentication();
app.UseAuthorization();

app.MapRazorPages();

app.Run();
