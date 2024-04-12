namespace DGMexToDo.Models
{
    public class AuditClass
    {
        public int Id { get; set; }
        public bool IsDeleted { get; set; } =false;
        public DateTime DateCreated { get; set; } = DateTime.Now;
        public DateTime LastModified { get; set; } = DateTime.Now;
    }
}
