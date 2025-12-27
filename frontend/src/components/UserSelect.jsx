import { useEffect, useState, useCallback } from "react";
import API from "../api";
import { 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  CircularProgress, 
  Alert,
  Box
} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function UserSelect({ onSelect }) {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");

  const fetchUsers = useCallback(() => {
    setLoading(true);
    API.get("/users")
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch users", err);
        setError("Failed to load users. Is the backend running?");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    onSelect(userId);
  };

  const createUser = async () => {
    if (!newUser.name || !newUser.email) return alert("Enter name and email");
    try {
      const res = await API.post("/users", newUser);
      setNewUser({ name: "", email: "" });
      fetchUsers();
      // Auto-select the new user
      setSelectedUser(res.data._id);
      onSelect(res.data._id);
    } catch (error) {
      console.error(error);
      alert("Failed to create user");
    }
  };

  return (
    <Paper elevation={3} sx={{ mb: 4, p: 3 }}>
      <Grid container spacing={3} alignItems="center">
        {/* Select User Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom color="primary">
            Select User
          </Typography>
          {loading ? (
            <CircularProgress size={24} />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <FormControl fullWidth>
              <InputLabel>Choose User</InputLabel>
              <Select
                value={selectedUser}
                label="Choose User"
                onChange={handleUserChange}
              >
                <MenuItem value="">
                  <em>-- Select --</em>
                </MenuItem>
                {users.map(u => (
                  <MenuItem key={u._id} value={u._id}>
                    {u.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Grid>

        {/* Divider for mobile */}
        <Grid item xs={12} md={1} sx={{ display: { xs: 'block', md: 'none' } }}>
           <hr />
        </Grid>

        {/* Create User Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ borderLeft: { md: "1px solid #e0e0e0" }, pl: { md: 3 } }}>
            <Typography variant="h6" gutterBottom color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonAddIcon /> Create New User
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField 
                label="Name" 
                variant="outlined" 
                size="small"
                value={newUser.name} 
                onChange={e => setNewUser({ ...newUser, name: e.target.value })} 
                sx={{ flex: 1 }}
              />
              <TextField 
                label="Email" 
                variant="outlined" 
                size="small"
                value={newUser.email} 
                onChange={e => setNewUser({ ...newUser, email: e.target.value })} 
                sx={{ flex: 1 }}
              />
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={createUser}
                disabled={loading}
              >
                Create
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
