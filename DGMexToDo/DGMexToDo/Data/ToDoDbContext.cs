using Microsoft.EntityFrameworkCore;
using DGMexToDo.Models;

namespace DGMexToDo.Data
{
    public class ToDoDbContext : DbContext
    {
        public ToDoDbContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<ToDoList> ToDoList { get; set; }
        public DbSet<ToDoTask> ToDoTask { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ToDoList>().HasData(
                new ToDoList
                {
                    Id = 1,
                    Name = "To Do",
                }
            );
        }
    }
}
