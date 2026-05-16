import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

const FILTERS = ["ALL", "ACTIVE", "COMPLETED"];

const ListTasks = () => {
  const { dark } = useTheme();
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [filter, setFilter] = useState("ALL");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "ACTIVE") return !task.completed;
    if (filter === "COMPLETED") return task.completed;
    return true;
  });

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
    <div className={`min-h-screen p-6 font-sans antialiased transition-colors duration-300 ${dark ? "bg-zinc-950" : "bg-[#FDFDFD]"}`}>
      <div className={`max-w-2xl mx-auto rounded-4xl shadow-lg p-8 border transition-colors duration-300 ${dark ? "bg-zinc-900 border-zinc-700" : "bg-white border-neutral-100"}`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-black uppercase ${dark ? "text-white" : "text-black"}`}>
            Task List
          </h1>
          <ThemeToggle />
        </div>

        {/* Filter Navigation */}
        <div className="flex justify-center mb-6">
          <div className={`flex gap-2 p-1 border rounded-full ${dark ? "border-zinc-700 bg-zinc-800" : "border-neutral-200 bg-neutral-50"}`}>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                  filter === f
                    ? "bg-black text-white"
                    : dark
                    ? "bg-transparent text-neutral-400 hover:text-white border border-transparent hover:border-zinc-600"
                    : "bg-transparent text-neutral-400 hover:text-black border border-transparent hover:border-neutral-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

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
                className={`flex items-center justify-between rounded-2xl p-4 shadow-sm transition-colors duration-200 ${dark ? "bg-zinc-800" : "bg-neutral-50"}`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="w-5 h-5 accent-black cursor-pointer"
                  />
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-semibold text-lg ${
                        task.completed
                          ? "line-through text-neutral-400"
                          : dark ? "text-white" : "text-black"
                      }`}
                    >
                      {task.text}
                    </span>

                    <span className={`text-[11px] font-black uppercase px-2 py-1 rounded-full ${dark ? "bg-zinc-700 text-neutral-300" : "bg-neutral-100 text-neutral-700"}`}>
                      {task.category ?? "TASK"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 font-bold text-sm ${dark ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-neutral-800"}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <Link
          to="/dashboard"
          className={`mt-12 font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center space-x-2 ${dark ? "text-neutral-400 hover:text-white" : "text-neutral-400 hover:text-black"}`}
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default ListTasks;
