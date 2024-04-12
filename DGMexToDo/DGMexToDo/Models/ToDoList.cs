namespace DGMexToDo.Models
{
    public class ToDoList : AuditClass
    {
        public string Name { get; set; }
        public bool isHidden { get; set; } = false;
        public List<ToDoTask> ToDoTasks { get; set; }
    }
}
