using DGMexToDo.Data;
using DGMexToDo.Models;
using DGMexToDo.Models.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DGMexToDo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoTaskController : ControllerBase
    {
        private ToDoDbContext _db;
        public ToDoTaskController(ToDoDbContext db)
        {
            _db = db;
        }

        [HttpGet(Name = "GetToDoTasks")]
        public async Task<ActionResult<IEnumerable<ToDoTask>>> Get()
        {
            var ToDoTasks = await _db.ToDoTask.ToListAsync();
            return ToDoTasks;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ToDoTask>> GetList(int id)
        {
            var ToDoTask = await _db.ToDoTask.FindAsync(id);
            return ToDoTask;
        }

        [HttpPost("{id}/tasks")]
        public async Task<ActionResult> AddTaskToList(int parentId, [FromBody] string name)
        {
            ToDoTask task = new ToDoTask();
            task.Name = name;
            task.IsDone = false;
            var todoList = await _db.ToDoList.Include(tl => tl.ToDoTasks).FirstOrDefaultAsync(tl => tl.Id == parentId);

            if (todoList == null)
            {
                return NotFound();
            }

            todoList.ToDoTasks.Add(task);
            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> UpdateTask([FromBody] ToDoTaskDTO Task)
        {
            ToDoTask task = await _db.ToDoTask.FindAsync(Task.Id);

            if (task == null)
            {
                return NotFound();
            }

            task.Name = Task.Name;
            task.IsDone = Task.IsDone;

            _db.ToDoTask.Update(task);
            await _db.SaveChangesAsync();

            return Ok(task);
        }
    }
}
