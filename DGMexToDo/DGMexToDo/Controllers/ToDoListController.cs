using DGMexToDo.Data;
using DGMexToDo.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace DGMexToDo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoListController : ControllerBase
    {
        private ToDoDbContext _db;
        public ToDoListController(ToDoDbContext db)
        {
            _db = db;
        }

        [HttpGet(Name = "GetToDoLists")]
        public async Task<ActionResult<IEnumerable<ToDoList>>> Get()
        {
            var toDoLists = await _db.ToDoList.Include(tl => tl.ToDoTasks).ToListAsync();
            return Ok(toDoLists);
        }

        [HttpGet("{id}")]
        public async Task<string> GetList(int id)
        {
            var toDoList = await _db.ToDoList.FindAsync(id);
            return JsonSerializer.Serialize(toDoList);
        }

        [HttpPost("{id}/updatelistname")]
        public async Task<IActionResult> UpdateListName(int id, [FromBody] string newListName)
        {
            var toDoList = await _db.ToDoList.FindAsync(id);

            if (toDoList == null)
            {
                return NotFound();
            }

            toDoList.Name = newListName;
            await _db.SaveChangesAsync();

            return NoContent();
        }

    }
}
