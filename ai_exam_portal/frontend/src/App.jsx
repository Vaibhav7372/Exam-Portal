import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ExamList from "./pages/ExamList";
import ExamDetail from "./pages/ExamDetail";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exams" element={<ExamList />} />  
        <Route path="/exam/:id" element={<ExamDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;