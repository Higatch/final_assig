import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReservationList from "./pages/ReservationList";
import ReservationForm from "./pages/ReservationForm";
import ReservationEdit from "./pages/ReservationEdit";
import CourseManagement from "./pages/CourseManagement";
import CourseEdit from "./pages/CourseEdit";
import NewCourse from "./pages/NewCourse";
import ScheduleManagement from "./pages/ScheduleManagement";
import Reservation from "./pages/Reservation";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/reservations" element={<ReservationList />} />
          <Route path="/reservations/new" element={<ReservationForm />} />
          <Route path="/reservations/edit/:id" element={<ReservationEdit />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/course-management" element={<CourseManagement />} />
          <Route path="/course/new" element={<NewCourse />} />
          <Route path="/schedule-management" element={<ScheduleManagement />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
