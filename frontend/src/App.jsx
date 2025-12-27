import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import Expenses from "./pages/Expenses";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { CircularProgress, Box } from "@mui/material";

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Expenses />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

export default App;