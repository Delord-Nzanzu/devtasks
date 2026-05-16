import { useState } from "react";
import { toast } from "sonner";
import { Link} from "react-router-dom"

const FILTERS = ["ALL", "ACTIVE", "COMPLETED"]; // ✅ Task 1 — filter options

const ListTasks = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [filter, setFilter] = useState("ALL"); // ✅ Task 1 — filter state
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // ✅ Task 1 — filter logic applied before rendering
  const filteredTasks = tasks.filter((task) => {
    if (filter === "ACTIVE") return !task.completed;
    if (filter === "COMPLETED") return task.completed;
    return true; // "ALL"
  });

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = (id) => {
    const trimmed = editingText.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: trimmed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setEditingId(null);
    toast.success("Task updated.", {
      style: { background: "#000000", color: "#ffffff" },
    });
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === "Enter") saveEdit(id);
    if (e.key === "Escape") setEditingId(null);
  };

  const deleteTask = (id) => {
    let deletedTasks = localStorage.getItem("deleted_tasks");

    if (deletedTasks == null) deletedTasks = [];
    else deletedTasks = JSON.parse(deletedTasks);

    const deletedTask = tasks.filter((task) => task.id === id)[0];

    const taskWithTimestamp = {
      ...deletedTask,
      deletedAt: new Date().toISOString(),
    };

    deletedTasks.push(taskWithTimestamp);

    localStorage.setItem("deleted_tasks", JSON.stringify(deletedTasks));

    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    toast.warning("Task permanently removed.", {
      style: { background: "#000000", color: "#ffffff" },
    });
  };

  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    const task = tasks.find((task) => task.id === id);
    if (task.completed) {
      toast.info("Task re-opened.", {
        style: { background: "#000000", color: "#ffffff" },
      });
    } else {
      toast.info("Task marked as complete.", {
        style: { background: "#000000", color: "#ffffff" },
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-6 font-sans antialiased">
      <div className="max-w-2xl mx-auto bg-white rounded-4xl shadow-lg p-8 border border-neutral-100">
        <h1 className="text-3xl font-black text-black mb-8 text-center uppercase">
          Task List
        </h1>

        {/* ✅ Task 2 — Filter Navigation */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2 p-1 border border-neutral-200 rounded-full bg-neutral-50">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                  filter === f
                    ? "bg-black text-white"
                    : "bg-transparent text-neutral-400 hover:text-black border border-transparent hover:border-neutral-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ✅ Task 3 — Updated task display using filteredTasks */}
        {filteredTasks.length === 0 ? (
          <p className="text-center text-neutral-400 font-medium py-8">
            {filter === "ACTIVE"
              ? "No active tasks. You're all caught up!"
              : filter === "COMPLETED"
              ? "No completed tasks yet."
              : "No tasks added yet."}
          </p>
        ) : (
          <ul className="space-y-4">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between bg-neutral-50 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="w-5 h-5 accent-black cursor-pointer shrink-0"
                  />
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {editingId === task.id ? (
                      <input
                        type="text"
                        value={editingText}
                        autoFocus
                        onChange={(e) => setEditingText(e.target.value)}
                        onBlur={() => saveEdit(task.id)}
                        onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                        className="flex-1 min-w-0 bg-transparent border-b-2 border-black outline-none font-bold text-lg text-black uppercase tracking-wide pb-0.5 transition-all duration-200"
                      />
                    ) : (
                      <span
                        className={`font-semibold text-lg truncate ${
                          task.completed
                            ? "line-through text-neutral-400"
                            : "text-black"
                        }`}
                      >
                        {task.text}
                      </span>
                    )}

                    <span className="text-[11px] font-black uppercase px-2 py-1 rounded-full bg-neutral-100 text-neutral-700 shrink-0">
                      {task.category ?? "TASK"}
                    </span>

                    {task.priority && (
                      <span
                        className={`text-[11px] font-black uppercase px-2 py-1 rounded-full shrink-0 ${
                          task.priority === "HIGH"
                            ? "bg-red-500/10 text-red-500"
                            : task.priority === "MEDIUM"
                            ? "bg-yellow-500/10 text-yellow-600"
                            : "bg-blue-500/10 text-blue-500"
                        }`}
                      >
                        {task.priority}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-3 shrink-0">
                  {!task.completed && editingId !== task.id && (
                    <button
                      onClick={() => startEditing(task)}
                      className="px-4 py-2 rounded-xl border border-black text-black font-bold text-sm hover:bg-black hover:text-white transition-all duration-300"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-black text-white px-4 py-2 rounded-xl hover:bg-neutral-800 transition-all duration-300 font-bold text-sm"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link
          to="/dashboard"
          className="mt-12 text-neutral-400 hover:text-black font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center space-x-2"
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default ListTasks;
