

using DataAccess.DbAccess;
using DataAccess.Models;
using DataAccess.Services;
using Microsoft.AspNetCore.Builder;
//using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Logging;
using WatchDog;
using Microsoft.Data.SqlClient;
using System.Net;
using System.Security.Policy;
using System;

namespace ImageGallery
{
    public static class ImageUpload
    {
        const string _sproc = "sproc";
        const string _text = "text";
        const string _commandType = "text"; // or  "sproc"

        //private static IServicesData<ImageURL>? _dbAccess;
        //private static ILogger? _logger;

        // static ImageUpload()
        //{
        //        // Initialization code for the static class
        //        //InitializeDependencies(_logger); //_dbAccess, 
        //}


        //// Static method for dependency injection
        //public static void InitializeDependencies(ILogger logger) //IServicesData<ImageURL> dbAccess,
        //{
        //    // Initialize the logger once for the static class
        //    //logger = loggerFactory.CreateLogger < MyStaticClass >

        //    //ImageUpload._dbAccess = dbAccess;
        //    //ImageUpload._logger = loggerFactory.CreateLogger();
        //    ImageUpload._logger = logger;


        //}

        public static void imageUploadRoutes(this WebApplication app)
        {
            //if (_logger == null)
            //{
            //    ImageUpload.InitializeDependencies(logger);
            //}

            var ImageGroup = app.MapGroup("/api/imagegallery");
            ImageGroup.MapPost("/upload", UploadImagesWithDetails);
            ImageGroup.MapGet("/unique", GetUniqueFileName);
            ImageGroup.MapGet("/search", GetFullName);
            ImageGroup.MapGet("/imagelist", GetImageListById);
            ImageGroup.MapGet("/{id}/list", GetImageListById);
        }

        private static async Task<IResult> GetFullName(IServicesData<dynamic> data,string name, int page = 1, int pageSize = 10 ) //, Gender? gender
        {
            try
            {
                var p = new { fullname = name };  ///new { } means no param 
                //var sql = "select  FullName, PNo from vwhpatients where fullname like '%' + @fullname + '%'  order by fullname"; //Expense_Select
                // Apply filtering and pagination logic
                var sql = $@"select FullName, PNo from vwhpatients where fullname like '%' + @fullname + '%' order by fullname offset {(page - 1) * pageSize} rows fetch next {pageSize} rows only";
                //return Results.Ok(await data.GetAll(sql, _commandType, p));
                var results = await data.GetAll(sql, _commandType, p);

                // Retrieve total count for pagination
                var totalCountSql = $@"select count(*) as total_count from vwhpatients where fullname like '%' + @fullname + '%'";
                var totalCount = (int)(await data?.GetById (totalCountSql,0, _commandType, p)).total_count;

                return Results.Ok(new
                {
                    results = results,
                    totalCount = totalCount,
                    currentPage = page,
                    pageSize = pageSize
                });
            }
            catch (SqlException ex)
            {
                // Log the exception if needed
                WatchLogger.Log($"An error occurred reading from db: {ex.Message}");
                //_logger.LogError($"An error occurred reading from db: {ex.Message}");

                // Return a problem response with a 500 Internal Server Error
                return Results.Problem("An unexpected error occurred reading from db.", statusCode: 500);
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                WatchLogger.Log($"An error occurred reading from db: {ex.Message}");
                //_logger.LogError($"An error occurred reading from db: {ex.Message}");

                // Return a problem response with a 500 Internal Server Error
                return Results.Problem("An unexpected error occurred reading from db.", statusCode: 500);
            }
        }

        private static async Task<IResult> GetImageListById(IServicesData<dynamic> data, string Id, int page = 1, int pageSize = 10)
        {
            try
            {
                //URL encoding, where the forward slash(/) is encoded as % 2F.
                //To convert it back to the original parameter in C#, you can use the WebUtility.UrlDecode method, which is part of the System.Net namespace.
                string encodedParameter = Id;
                string PNo = WebUtility.UrlDecode(encodedParameter);

                var p = new { PNo = PNo };  ///new { } means no param 
                // Apply filtering and pagination logic
                var sql = $@"select ImageURL, PNo from vwhPatientsImageURL where PNo = @PNo order by ImageURL offset {(page - 1) * pageSize} rows fetch next {pageSize} rows only";
                //return Results.Ok(await data.GetAll(sql, _commandType, p));
                var results = await data.GetAll(sql, _commandType, p);

                // Retrieve total count for pagination
                var totalCountSql = $@"select count(*) as total_count from vwhPatientsImageURL where PNo = @PNo";
                var totalCount = (int)(await data?.GetById(totalCountSql, 0, _commandType, p)).total_count;

                //WatchLogger.Log($"creating response for frontend");
                //_logger.LogError($"creating response for frontend");

                return Results.Ok(new
                {
                    results = results,
                    totalCount = totalCount,
                    currentPage = page,
                    pageSize = pageSize
                });
            }
            catch (SqlException ex)
            {
                // Log the exception if needed
                WatchLogger.Log($"An error occurred reading from db: {ex.Message}");
                //_logger.LogError($"An error occurred reading from db: {ex.Message}");

                // Return a problem response with a 500 Internal Server Error
                return Results.Problem("An unexpected error occurred reading from db.", statusCode: 500);
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                WatchLogger.Log($"An error occurred reading from db: {ex.Message}");
                //_logger.LogError($"An error occurred reading from db: {ex.Message}");

                // Return a problem response with a 500 Internal Server Error
                return Results.Problem("An unexpected error occurred reading from db.", statusCode: 500);
            }
        }

        public static async Task<IResult> UploadImagesWithDetails(HttpContext context, IWebHostEnvironment hostingEnv, IServicesData<ImageURL>? _dbAccess)
        {
            //if (model == null)
            //{
            //    throw new ArgumentNullException("model");
            //}

            //bool result = false;

            try
            {
                // Check if the context.Request is null
                if (context != null)
                {
                    // Retrieve additional fields
                    string? fullName = context.Request.Form["fullname"];
                    string? category = context.Request.Form["category"];
                    string? PNo = context.Request.Form["imageURL"];
                    string? remarks = context.Request.Form["remarks"];

                    var files = context.Request.Form.Files;

                    foreach (IFormFile file in files)
                    {
                        var fileName = await GetUniqueFileName(_dbAccess, file.FileName, PNo);
                        //string imgFolderPath = $"{hostingEnv.ContentRootPath}\\Uploads\\{PNo}";
                        string imgFolderPath = Path.Combine(hostingEnv.ContentRootPath,"Uploads",PNo);


                        try
                        {
                            if (!System.IO.Directory.Exists(imgFolderPath))
                                System.IO.Directory.CreateDirectory(imgFolderPath);

                            string filePath = Path.Combine(imgFolderPath, fileName?.ToString());

                            if (System.IO.File.Exists(filePath))
                                System.IO.File.Delete(filePath);

                            using (FileStream stream = System.IO.File.Create(filePath))
                            {
                                await file.CopyToAsync(stream);
                                // Now you can use the additional fields (fullname, category, imageURL, remarks) as needed
                                // For example, you might want to save them in a database or log them
                                 await SaveImageDetailsToDatabase(_dbAccess, category, PNo, remarks, fileName.ToString());
                                //result = true;

                            }

                        }
                        catch (IOException ex)
                        {
                            // Log the exception details
                            WatchLogger.Log($"Error uploading file {fileName}: {ex.Message}");
                            //_logger.LogError($"Error uploading file {fileName}: {ex.Message}");
                            // You can also handle the exception differently, e.g., return a specific error response
                            return Results.Problem($"Error uploading file {fileName} to folder: {ex.Message}");
                        }
                        catch (SqlException ex)
                        {
                            // Log the exception if needed
                            //_logger.LogError($"An error occurred saving to db: {ex.Message}");

                            // Return a problem response with a 500 Internal Server Error
                            //return Results.Problem("An unexpected error occurred saving to db.", statusCode: 500);

                            WatchLogger.Log($"An error occurred saving to db: {ex.Message}");
                            return Results.Problem(ex.Message, statusCode: 500);
                        }
                        catch (Exception ex)
                        {
                            // Log the exception details
                            //_logger.LogError($"Error uploading file {fileName}: {ex.Message}");
                            // You can also handle the exception differently, e.g., return a specific error response
                            //return Results.Problem($"Error uploading file {fileName} to folder: {ex.Message}");
                            WatchLogger.Log($"Internal Server Error: {ex.Message}");
                            return Results.Problem(ex.Message, statusCode: 500);
                        }
                    }
                }
                else
                {
                    // Handle the case where context.Request is null
                    WatchLogger.Log("HttpContext.Request is null");
                    //_logger.LogError("HttpContext.Request is null");
                    // You can also return a specific error response
                    return Results.Problem("HttpContext.Request is null");
                }
            }
            catch (Exception ex)
            {
                // Log the exception details at a higher level
                WatchLogger.Log($"Error processing file upload request: {ex.Message}");
                //_logger.LogError($"Error processing file upload request: {ex.Message}");
                // You can also handle the exception differently, e.g., return a specific error response
                return Results.Problem($"Error processing file upload request: {ex.Message}");
            }

            return Results.Ok();
        }

        private static async Task<IResult> SaveImageDetailsToDatabase(IServicesData<ImageURL>? _dbAccess, string category, string PNo, string remarks, string fileName)
        {
            try
            {
                // Implement logic to save the details to a database or perform any other necessary actions
                var PNoDash = PNo; // nece b4 modify pno
                PNo = PNo.Replace("-", "/");
                //var imageUrl = Path.Combine("/Uploads", PNoDash, fileName) ;
                var imageUrl = $"/Uploads/{PNoDash}/{fileName}";

                var imageURL = new ImageURL
                {
                    PNo = PNo,
                    ImageUrl = imageUrl,
                    Remarks = remarks,
                    Category = category
                };

                //var imageUrl = $"{PNo}/{fileName}";
                //PNo = PNo.Replace("-", "/"); // must be after imageUrl

                var p = new
                {
                    PNo = PNo,
                    ImageURL = imageUrl,
                    Remarks = remarks,
                    Category = category
                };
                var sql = @"hPatientsImageURL_Insert"; //Expense_Select
                await _dbAccess?.Insert(sql, imageURL, _sproc, p);
                return Results.Ok();
            }
            catch (SqlException ex)
            {
                // Log the exception if needed
                //_logger.LogError($"An error occurred saving to db: {ex.Message}");

                // Return a problem response with a 500 Internal Server Error
                //return Results.Problem("An unexpected error occurred saving to db.", statusCode: 500);

                WatchLogger.Log($"An error occurred saving to db: {ex.Message}");
                throw; // new Exception(ex.Message);
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                //_logger.LogError($"An error occurred saving to db: {ex.Message}");

                // Return a problem response with a 500 Internal Server Error
                //return Results.Problem("An unexpected error occurred saving to db.", statusCode: 500);

                WatchLogger.Log($"An error occurred saving to db: {ex.Message}");
                throw; // new Exception(ex.Message);
            }

        }
        private static async Task<string> GetUniqueFileName(IServicesData<ImageURL>? _dbAccess, string fileName, string PNo)
        {
            try
            {
               // Generate a unique filename based on the original filename
                string extension = Path.GetExtension(fileName);
                string baseFileName = Path.GetFileNameWithoutExtension(fileName);

                PNo = PNo.Replace("-", "/");
                var p = new { PNo };  //same as { PNo = PNo }
                //var result = await GetImageCodeAsName(PNo, _dbAccess);
                //var sql = @"select MAX(CAST(SUBSTRING(ImageURL, 15, 4) AS BIGINT)) as ImageUrl from hPatientsImageURL where PNo=@PNo";
                //var sql = @"select MAX(SUBSTRING(ImageURL, 15, 4)) as ImageUrl from hPatientsImageURL where PNo=@PNo;";
                //var sql = @"select MAX(CAST(SUBSTRING(ImageURL, 15, 4) AS BIGINT)) as ImageUrl from hPatientsImageURL";

                var sql = @"SELECT TOP 1 * FROM hPatientsImageURL WHERE PNo = @PNo ORDER BY SNo DESC";
                var result = await _dbAccess.GetById(sql, PNo, _commandType, p);
                if (result?.ImageUrl == "" || result?.ImageUrl == null) return $"0001{extension}";   //result.ImageUrl = "0000"; 
                //Console.WriteLine(results.CatCode);
                //return results.ImageUrl;

                var pixCode = result.ImageUrl.Substring(23, 4).ToString();
                if (pixCode != null)
                {
                    //var intCode2 = pixCode.SubString(0, 3) + (Convert.ToInt32(catCode.Substring(3)) + 1).ToString("000");
                    var intCode = Convert.ToInt32(pixCode) + 1; // Convert to int and increment
                    pixCode = intCode.ToString("0000"); // Format as a four-digit string
                }
                else
                {
                    pixCode = "0001";
                }


                //return $"{baseFileName}_{DateTime.Now:yyyyMMddHHmmssfff}{extension}";
                return $"{pixCode}{extension}";
            }
            catch (Exception ex)
            {
                // Log the exception if needed
                //_logger.LogError($"Error generating UniqueFileName: {ex.Message}");

                // Rethrow the exception (if needed) or handle it by returning an error string
                // Here, I'm returning an error string, but you might choose to rethrow the exception or use a custom exception type
                //return $"Error generating UniqueFileName: {ex.Message}";
                //return Results.Problem(ex.Message, statusCode: 500);
                //Results.Problem($"Error generating UniqueFileName for: {fileName} to Upload to folder. Error: {ex.Message}");

                WatchLogger.Log($"Error generating UniqueFileName: {ex.Message}");
                throw; // new Exception(ex.Message);
            }
        }


        private static async Task<string> GetImageCodeAsName(string PNo, IServicesData<ImageURL> _dbAccess)
        {
            try
            {
                var p = new { PNo };  //same as { PNo = PNo }
                var sql = @"select MAX(CAST(SUBSTRING(ImageURL, 15, 4) AS BIGINT)) as ImageUrl from hPatientsImageURL where PNo=@PNo";
                var results = await _dbAccess.GetById(sql, 0, _commandType, p);
                if (results == null) return "0001";
                //Console.WriteLine(results.CatCode);
                return results.ImageUrl;
            }
            catch (Exception ex)
            {
                //return Results.Problem(ex.Message);
                throw new Exception(ex.Message);
            }

        }

        private static async Task<IResult> XxxGetUniqueFileName(string id, IServicesData<ImageURL> data)
        {
            try
            {
                id = id.Replace("-", "/");
                var p = new { PNo=id };  //same as { PNo = PNo }
                var sql = @"SELECT TOP 1 ImageURL FROM hPatientsImageURL WHERE PNo = @PNo ORDER BY SNo DESC";
                var results = await data.GetById(sql, id, _commandType, p);
                if (results == null) return Results.NotFound();
                return Results.Ok(results);
            }
            catch (Exception ex)
            {
                return Results.Problem(ex.Message);
            }
        }

 
        [NonAction]
        public static string GetActualPath(IWebHostEnvironment host, string FileName, string pNo)
        {
            //IWebHostEnvironment hostingEnv;
            var newPath = $"{host.ContentRootPath} \\Uploads\\{pNo}\\{FileName}";
            return newPath ;
        }

        private static ActionResult Ok(bool result)
        {
            throw new NotImplementedException();
        }



        //private static async Task<IResult> GetExpenseCategories(IServicesData<ExpenseCategory> data)
        //{
        //    try
        //    {
        //        //new { } means no param
        //        var p = new { CatType = "EXPENSES" };  //new { }; 
        //        var sql = "select * from hExpenseCat where CatType =@CatType order by CatName"; //Expense_Select
        //        return Results.Ok(await data.GetAll(sql, _commandType, p));
        //    }
        //    catch (Exception ex)
        //    {
        //        return Results.Problem(ex.Message);
        //    }
        //}


    }
}
