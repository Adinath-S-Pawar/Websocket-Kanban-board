---

# Real-time Kanban Board (WebSockets + React + Node)

A real-time Kanban board application built with React and Node.js using WebSockets (Socket.IO).  
User can create, move, update, and delete tasks simultaneously with live synchronization.  
This project includes comprehensive testing using Vitest, React Testing Library, and Playwright.

---

## 📦 Features

###  Kanban Board
- Create, update, and delete tasks
- Drag and drop tasks between columns (Todo / In Progress / Done)
- Real-time updates using WebSockets
- Multi-client synchronization

###  Dropdown Select Testing
- Select task priority
- Change task category and verify updates

###  File Upload Testing
- Upload files
- Uploaded files display correctly
- Invalid files show an error message

### ✅ Graph Testing
- Task counts update correctly in the chart
- Graph re-renders dynamically when tasks are added or moved

---

## 🛠 Technology Stack

**Frontend**
- React
- CSS Modules
- Socket.IO Client

**Backend**
- Node.js
- Express
- Socket.IO

**Testing**
### Unit & Integration Testing (Vitest + React Testing Library)
- Task CRUD logic
- WebSocket connection logic
- Multi-client state synchronization
- Drag-and-drop functionality

### E2E Testing (Playwright)
- Task creation
- Drag-and-drop between columns
- Real-time sync updates
- File upload validation
- Graph re-rendering


---

## 📁 Project Structure

```bash
Websocket-Kanban-board/
│
├── backend/
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Column.jsx
│   │   │   ├── Column.module.css
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── KanbanBoard.module.css
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskCard.module.css
│   │   │   └── TaskProgressChart.jsx
│   │   │
│   │   ├── tests/
│   │   │   ├── e2e/
│   │   │   │   └── KanbanBoard.e2e.test.js
│   │   │   │
│   │   │   ├── fixtures/
│   │   │   │   └── taskData.js
│   │   │   │
│   │   │   ├── integration/
│   │   │   │   ├── DragAndDrop.test.jsx
│   │   │   │   ├── MultiClientSync.test.jsx
│   │   │   │   └── WebSocketIntegration.test.jsx
│   │   │   │
│   │   │   ├── unit/
│   │   │   │   ├── Column.test.jsx
│   │   │   │   ├── KanbanBoard.test.jsx
│   │   │   │   ├── TaskCard.test.jsx
│   │   │   │   └── TaskProgressChart.test.jsx
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── socketMock.js
│   │   │       └── testUtils.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── setupTests.js
│   │   └── socket.js
│   │
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── playwright.config.js
│   └── vite.config.js
│
└── README.md
```
---
## 🚀 Local Setup

### 1) Clone the repo
```bash
git clone https://github.com/Adinath-S-Pawar/Websocket-Kanban-board.git
cd Websocket-Kanban-board
```

---

### 2) Install dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

---

### 3) Run the application

#### Start backend
```bash
cd backend
node server.js
```

Backend runs on:
```
http://localhost:5000
```

#### Start frontend
```bash
cd frontend
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## 🧪 Testing

### Unit + Integration Tests
```bash
cd frontend
npx vitest
```

### End-to-End (E2E) Tests
```bash
cd frontend
npx playwright test
```

To view the E2E test report:
```bash
npx playwright show-report
```

---

## 🤝 Contribution

Feel free to open issues or submit pull requests.

---
