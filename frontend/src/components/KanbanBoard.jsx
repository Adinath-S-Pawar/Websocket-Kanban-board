import React, { useEffect, useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { socket } from "../socket";
import styles from "./KanbanBoard.module.css";

const COLUMNS = [
  { key: "todo", title: "To Do" },
  { key: "inprogress", title: "In Progress" },
  { key: "done", title: "Done" },
];

const ItemTypes = {
  TASK: "task",
};

function TaskCard({ task }) {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={dragRef}
      className={styles.taskCard}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <h4 className={styles.taskTitle}>{task.title}</h4>

      {task.description && <p className={styles.taskDesc}>{task.description}</p>}

      <p className={styles.taskMeta}>
        <b>Priority:</b> {task.priority} | <b>Category:</b> {task.category}
      </p>
    </div>
  );
}

function Column({ columnKey, title, tasks }) {
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item) => {
      
      socket.emit("task:move", { id: item.id, newStatus: columnKey });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={dropRef}
      className={styles.column}
      style={{
        outline: isOver ? "2px dashed black" : "none",
      }}
    >
      <h3 className={styles.columnTitle}>
        {title} ({tasks.length})
      </h3>

      <div className={styles.taskList}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && <p className={styles.emptyText}>No tasks here.</p>}
      </div>
    </div>
  );
}

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [category, setCategory] = useState("Bug");

  const TasksByStatus = useMemo(() => {
    return {
      todo: tasks.filter((t) => t.status === "todo"),
      inprogress: tasks.filter((t) => t.status === "inprogress"),
      done: tasks.filter((t) => t.status === "done"),
    };
  }, [tasks]);

  useEffect(() => {
    const onConnect = () => {
      socket.emit("sync:tasks");
    };

    const onSyncTasks = (serverTasks) => {
      setTasks(serverTasks);
      setLoading(false);
    };

    socket.on("connect", onConnect);
    socket.on("sync:tasks", onSyncTasks);

    return () => {
      socket.off("connect", onConnect);
      socket.off("sync:tasks", onSyncTasks);
    };
  }, []);

  function HandleCreateTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    socket.emit("task:create", {
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      status: "todo",
      attachments: [],
    });

    setTitle("");
    setDescription("");
    setPriority("low");
    setCategory("Bug");
  }

  if (loading) {
    return (
      <div className={styles.kanbanContainer}>
        <h2 className={styles.kanbanHeader}>Kanban Board</h2>
        <p className={styles.loadingText}>Loading tasks from server...</p>
      </div>
    );
  }

  return (
    <div className={styles.kanbanContainer}>
      <h2 className={styles.kanbanHeader}>Kanban Board</h2>

      {/* Task Form */}
      <form className={styles.taskForm} onSubmit={HandleCreateTask}>
        <input
          type="text"
          placeholder="Task title (required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Bug">Bug</option>
          <option value="Feature">Feature</option>
          <option value="Enhancement">Enhancement</option>
        </select>

        <textarea
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit" disabled={!title.trim()}>
          Add Task
        </button>
      </form>

      {/* Board */}
      <div className={styles.boardGrid}>
        {COLUMNS.map((col) => (
          <Column
            key={col.key}
            columnKey={col.key}
            title={col.title}
            tasks={TasksByStatus[col.key]}
          />
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;
