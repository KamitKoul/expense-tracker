import { useState, useEffect, useCallback, useContext } from "react";
import API from "../api";
import AuthContext from "../context/AuthContext";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseSummary from "../components/ExpenseSummary";
import ExpenseChart from "../components/ExpenseChart";
import { 
  Typography, 
  Box, 
  Fade, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  AppBar,
  Toolbar
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';

export default function Expenses() {
  const { user, logout } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  
  // Filter states
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const fetchExpensesData = async () => {
    try {
      // Fetch all expenses, we can filter locally or via API
      // Since API supports get all for user, let's do that and filter locally for responsiveness
      const res = await API.get(`/expenses`);
      return res.data;
    } catch (error) {
      console.error("Failed to load expenses", error);
      return [];
    }
  };

  const refreshExpenses = useCallback(async () => {
      const data = await fetchExpensesData();
      setExpenses(data);
  }, []);

  useEffect(() => {
    refreshExpenses();
  }, [refreshExpenses]);

  // Apply filters
  useEffect(() => {
    const filtered = expenses.filter(exp => {
      const d = new Date(exp.expenseDate);
      return (d.getMonth() + 1) === filterMonth && d.getFullYear() === filterYear;
    });
    setFilteredExpenses(filtered);
  }, [expenses, filterMonth, filterYear]);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            💰 Expense Tracker
          </Typography>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Welcome, {user?.name}
          </Typography>
          <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
        <Fade in={true}>
          <Box>
            {/* Filter Section */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'flex-end', alignItems: 'center' }}>
              <Typography variant="body1">Filter by:</Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Month</InputLabel>
                <Select value={filterMonth} label="Month" onChange={(e) => setFilterMonth(e.target.value)}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <MenuItem key={m} value={m}>{new Date(0, m-1).toLocaleString('default', { month: 'long' })}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Year</InputLabel>
                <Select value={filterYear} label="Year" onChange={(e) => setFilterYear(e.target.value)}>
                  {[2023, 2024, 2025, 2026].map(y => (
                    <MenuItem key={y} value={y}>{y}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <ExpenseSummary year={filterYear} month={filterMonth} refreshTrigger={filteredExpenses} />
                <ExpenseForm 
                  key={editingExpense ? editingExpense._id : 'new'}
                  refresh={refreshExpenses} 
                  editingExpense={editingExpense} 
                  onCancelEdit={() => setEditingExpense(null)}
                />
                <ExpenseList 
                  expenses={filteredExpenses} 
                  refresh={refreshExpenses} 
                  onEdit={setEditingExpense}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                 <ExpenseChart data={filteredExpenses} />
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}