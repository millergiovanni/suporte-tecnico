using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Get the path to the static files (parent directory's subfolder)
var staticFilesPath = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, "..", "suporte-tecnico-main"));

if (!Directory.Exists(staticFilesPath))
{
    Console.WriteLine($"Directory not found: {staticFilesPath}");
    return;
}

app.UseDefaultFiles(new DefaultFilesOptions
{
    FileProvider = new PhysicalFileProvider(staticFilesPath)
});

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(staticFilesPath)
});

Console.WriteLine($"Serving files from: {staticFilesPath}");
Console.WriteLine("Access the application at: http://localhost:5000");

app.Run("http://localhost:5000");
