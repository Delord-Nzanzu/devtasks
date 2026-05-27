import { useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

const DataCenter = () => {
  const { dark } = useTheme();
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    const exportData = {
      exportedAt: new Date().toISOString(),
      tasks,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devtasks-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Tasks exported successfully!");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);

        // validate structure
        if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
          toast.error("Invalid file format — missing tasks array");
          return;
        }

        // validate each task has required fields
        const isValid = parsed.tasks.every(
          (task) =>
            typeof task.id !== "undefined" &&
            typeof task.text === "string" &&
            ["FEATURE", "BUG", "REFACTOR"].includes(task.category) &&
            ["HIGH", "MEDIUM", "LOW"].includes(task.priority) &&
            typeof task.completed === "boolean"
        );

        if (!isValid) {
          toast.error("File contains invalid task data");
          return;
        }

        localStorage.setItem("tasks", JSON.stringify(parsed.tasks));
        toast.success(`${parsed.tasks.length} tasks imported successfully!`);
      } catch {
        toast.error("Failed to read file — please upload a valid JSON");
      }
    };

    reader.readAsText(file);

    // reset input so same file can be re-imported
    e.target.value = "";
  };

  const actions = [
    {
      id: "export",
      label: "Export Tasks",
      description: "Download your tasks as a JSON backup file",
      onClick: handleExport,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      ),
    },
    {
      id: "import",
      label: "Import Tasks",
      description: "Restore tasks from a previously exported JSON file",
      onClick: () => fileInputRef.current.click(),
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 selection:bg-black selection:text-white font-sans antialiased transition-colors duration-300 ${
        dark ? "bg-zinc-950" : "bg-[#FDFDFD]"
      }`}
    >
      {/* React 19 Document Metadata Hoisting */}
      <title>Data Center & Backups — Dev Tasks JSON Portability</title>
      <meta
        name="description"
        content="Import and export your developer roadmaps and task lists as JSON backups. Keep task structures fully portable and safe."
      />
      <meta
        name="keywords"
        content="devtasks, data-center, json export, task backup, restore lists, developer tools"
      />

      <div
        className={`w-full max-w-[480px] rounded-5xl p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] border flex flex-col items-center text-center relative overflow-hidden transition-colors duration-300 ${
          dark ? "bg-zinc-900 border-zinc-700" : "bg-white border-neutral-100"
        }`}
      >
        {/* Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-black dark:bg-white" />

        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="space-y-3 mt-5 mb-12">
          <h1
            className={`text-4xl font-black tracking-tight uppercase ${
              dark ? "text-white" : "text-black"
            }`}
          >
            Data Center
          </h1>
          <p className="text-neutral-400 font-medium text-lg">
            Backup &amp; restore your tasks
          </p>
        </div>

        <div className="w-full space-y-4">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              id={`datacenter-action-${action.id}`}
              className={`group w-full flex items-center gap-4 border-2 border-transparent rounded-4xl px-6 py-5 text-left transition-all duration-300 font-semibold ${
                dark
                  ? "bg-zinc-800 text-white hover:bg-zinc-700 hover:border-zinc-600"
                  : "bg-neutral-50 text-black hover:bg-white hover:border-black"
              }`}
            >
              <div
                className={`p-2 rounded-xl transition-colors ${
                  dark
                    ? "bg-zinc-700 text-white group-hover:bg-zinc-600"
                    : "bg-neutral-100 text-black group-hover:bg-black group-hover:text-white"
                }`}
              >
                {action.icon}
              </div>
              <div>
                <div className="text-sm font-black uppercase tracking-widest">
                  {action.label}
                </div>
                <div
                  className={`text-xs font-medium mt-0.5 ${
                    dark ? "text-zinc-400" : "text-neutral-400"
                  }`}
                >
                  {action.description}
                </div>
              </div>
              <span className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                →
              </span>
            </button>
          ))}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
        <div className="flex justify-between items-center gap-3 mt-8 w-full">
          <Link to="/list-tasks">
            <button
              className={`px-5 py-2 cursor-pointer rounded-2xl text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 border ${
                dark
                  ? "bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
                  : "bg-neutral-100 text-black border-neutral-200 hover:bg-neutral-200"
              }`}
            >
              Task List
            </button>
          </Link>

          <Link to="/delete-history">
            <button
              className={`px-5 py-2 cursor-pointer rounded-2xl text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 border ${
                dark
                  ? "bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700"
                  : "bg-neutral-100 text-black border-neutral-200 hover:bg-neutral-200"
              }`}
            >
              Deleted Tasks
            </button>
          </Link>
        </div>
        <Link
          to="/dashboard"
          className={`mt-12 font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center space-x-2 ${
            dark
              ? "text-neutral-400 hover:text-white"
              : "text-neutral-400 hover:text-black"
          }`}
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Decorative Blur Elements */}
      <div
        className={`fixed top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] -z-10 opacity-60 ${
          dark ? "bg-zinc-800" : "bg-neutral-100"
        }`}
      />
      <div
        className={`fixed bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] -z-10 opacity-60 ${
          dark ? "bg-zinc-900" : "bg-neutral-50"
        }`}
      />
    </div>
  );
};

export default DataCenter;
