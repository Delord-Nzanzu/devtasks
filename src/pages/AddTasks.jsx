import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const AddTasks = () => {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("FEATURE");
  const [priority, setPriority] = useState("MEDIUM");
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!task.trim()) return;

    const newTask = {
      id: Date.now(),
      text: task,
      category,
      priority,
      completed: false,
    };

    setTasks([...tasks, newTask]);

    toast.success("Task successfully added to roadmap.", {
      style: { background: "#000000", color: "#ffffff" },
    });

    setTask("");
    setPriority("MEDIUM");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 selection:bg-black selection:text-white font-sans antialiased">
      <div className="w-full max-w-[480px] bg-white rounded-5xl p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] border border-neutral-100 flex flex-col items-center text-center relative overflow-hidden">
        {/* Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-black"></div>

        {/* Icon Header */}
        <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-black/20 group hover:scale-105 transition-transform duration-500 cursor-pointer">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>

        <div className="space-y-3 mb-12">
          <h1 className="text-4xl font-black text-black tracking-tight uppercase">
            Add Task
          </h1>
          <p className="text-neutral-400 font-medium text-lg">
            What's on your mind today?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-8">
          <div className="relative group text-left">
            <label
              htmlFor="task-input"
              className="block text-[11px] font-black text-neutral-400 uppercase tracking-[0.25em] mb-3 ml-6"
            >
              Task Description
            </label>

            <input
              id="task-input"
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. Optimize database queries"
              className="w-full bg-neutral-50 border-2 border-transparent rounded-4xl px-8 py-5 text-black placeholder:text-neutral-300 focus:bg-white focus:border-black transition-all duration-300 outline-none font-semibold text-lg shadow-sm"
              autoFocus
            />
          </div>

          <div className="text-left">
            <label className="block text-[11px] font-black text-neutral-400 uppercase tracking-[0.25em] mb-3 ml-6">
              Category
            </label>

            <div className="flex items-center gap-3 ml-6">
              {["FEATURE", "BUG", "REFACTOR"].map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setCategory(opt)}
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-200 cursor-pointer border ${
                    category === opt
                      ? "bg-black text-white"
                      : "bg-neutral-100 text-neutral-600 border-transparent hover:bg-neutral-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="text-left">
            <label className="block text-[11px] font-black text-neutral-400 uppercase tracking-[0.25em] mb-3 ml-6">
              Priority
            </label>

            <div className="flex items-center gap-3 ml-6">
              {[
                { value: "HIGH", color: "bg-red-500 text-white border-red-500", inactive: "bg-red-500/10 text-red-500 border-red-200 hover:bg-red-500/20" },
                { value: "MEDIUM", color: "bg-yellow-500 text-white border-yellow-500", inactive: "bg-yellow-500/10 text-yellow-600 border-yellow-200 hover:bg-yellow-500/20" },
                { value: "LOW", color: "bg-blue-500 text-white border-blue-500", inactive: "bg-blue-500/10 text-blue-500 border-blue-200 hover:bg-blue-500/20" },
              ].map(({ value, color, inactive }) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setPriority(value)}
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-200 cursor-pointer border ${
                    priority === value ? color : inactive
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="group w-full bg-black text-white font-black py-6 rounded-4xl shadow-2xl shadow-black/40 hover:bg-neutral-800 active:scale-[0.98] transition-all duration-500 flex items-center justify-center space-x-4 text-xl tracking-wide"
          >
            <span>CREATE TASK</span>

            <div className="bg-white/20 p-2 rounded-full group-hover:translate-x-1 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </button>
        </form>

        <Link
          to="/dashboard"
          className="mt-12 text-neutral-400 hover:text-black font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center space-x-2"
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Decorative Blur Elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-neutral-100 rounded-full blur-[120px] -z-10 opacity-60"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-neutral-50 rounded-full blur-[120px] -z-10 opacity-60"></div>
    </div>
  );
};

export default AddTasks;
