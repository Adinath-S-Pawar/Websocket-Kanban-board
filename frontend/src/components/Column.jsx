import React from "react";
import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";
import styles from "./Column.module.css";

export default function Column({ column, tasks, socket }) {
  const SafeTasks = Array.isArray(tasks) ? tasks : [];
  const [{ IsOver }, dropRef] = useDrop(() => ({
    accept: "TASK",
    drop: (DraggedItem) => {
      if (!DraggedItem?.id) return;
      if (DraggedItem?.isEditing) return;

      socket?.emit?.("task:move", {
        id: DraggedItem.id,
        newStatus: column.key,
      });
    },
    collect: (monitor) => ({
      IsOver: monitor.isOver(),
    }),
  }), [column.key, socket]);

  return (
    
    <div ref={dropRef} 
         data-testid={`drop-column-${column.key}`}
         className={`${styles.column} ${IsOver ? styles.columnHover : ""}`}>
      <div className={styles.columnHeader}>
        <h3 className={styles.columnTitle}>{column.title}</h3>
        <span className={styles.taskCountBadge}>{SafeTasks.length}</span>
      </div>

      <div className={styles.taskList}>
        {SafeTasks.map((task) => (
          <TaskCard key={task.id} task={task} socket={socket} />
        ))}
      </div>
    </div>

  );
}
