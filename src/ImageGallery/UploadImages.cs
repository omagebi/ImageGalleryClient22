namespace ImageGallery
{
    public class UploadImages
    {
        readonly IConfiguration _config;

        public UploadImages(IConfiguration config)
        {
            _config=config;
        }

        public string Post(HttpContext context)
        {
            for (var i = 0; context.Request.Form.Files.Count < 10; i++)
            {
                var file = context.Request.Form.Files[i];
                //var path= Path.Combine(host, file.Name);
            }

            return "ok";
        }
    }
}
