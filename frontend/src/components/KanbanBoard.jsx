import React, { useEffect, useState } from "react";
import { socket } from "../socket";

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onConnect = () => {
      console.log("Connected:", socket.id);
      socket.emit("sync:tasks");
    };

    const onSyncTasks = (serverTasks) => {
      console.log("Synced tasks:", serverTasks);
      setTasks(serverTasks);
      setLoading(false);
    };

    const onDisconnect = () => {
      console.log("Disconnected");
    };

    socket.on("connect", onConnect);
    socket.on("sync:tasks", onSyncTasks);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("sync:tasks", onSyncTasks);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  if (loading) {
    return (
      <div>
        <h2>Kanban Board</h2>
        <p>Loading tasks from server...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Kanban Board</h2>
      <p>
        Synced Tasks: <b>{tasks.length}</b>
      </p>
    </div>
  );
}

export default KanbanBoard;
