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
  Grid, 
  FormControl, 
  Select, 
  MenuItem,
  AppBar,
  Toolbar,
  Container,
  IconButton,
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Tooltip,
  useTheme
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

export default function Expenses() {
  const { user, logout } = useContext(AuthContext);
  const theme = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  
  // Dialog State
  const [openForm, setOpenForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Filter states
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const fetchExpensesData = async () => {
    try {
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

  useEffect(() => {
    const filtered = expenses.filter(exp => {
      const d = new Date(exp.expenseDate);
      return (d.getMonth() + 1) === filterMonth && d.getFullYear() === filterYear;
    });
    setFilteredExpenses(filtered);
  }, [expenses, filterMonth, filterYear]);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingExpense(null);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Navbar */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #f0f0f0' }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, md: 4, lg: 6 } }}>
            <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ p: 0.5, bgcolor: theme.palette.primary.main, borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1 }}>₹</Typography>
                </Box>
                <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800, letterSpacing: -0.5 }}>
                    ExpenseTracker
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                        {user?.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {user?.email}
                    </Typography>
                </Box>
                <Avatar sx={{ bgcolor: theme.palette.primary.light }}>{user?.name?.[0]}</Avatar>
                <Tooltip title="Logout">
                    <IconButton onClick={logout} color="default">
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth={false} sx={{ px: { xs: 2, md: 4, lg: 6 }, py: 4 }}>
        <Fade in={true}>
          <Box>
            {/* Header & Filters */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, mb: 4, gap: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>Dashboard</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>Overview of your spending habits</Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'white', p: 1, borderRadius: 3, border: '1px solid #f0f0f0' }}>
                <FilterListIcon color="action" sx={{ ml: 1 }} />
                <FormControl variant="standard" sx={{ minWidth: 100 }}>
                  <Select 
                    disableUnderline
                    value={filterMonth} 
                    onChange={(e) => setFilterMonth(e.target.value)}
                    sx={{ fontWeight: 500 }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <MenuItem key={m} value={m}>{new Date(0, m-1).toLocaleString('default', { month: 'short' })}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant="standard" sx={{ minWidth: 80 }}>
                  <Select 
                    disableUnderline
                    value={filterYear} 
                    onChange={(e) => setFilterYear(e.target.value)}
                    sx={{ fontWeight: 500 }}
                  >
                    {[2023, 2024, 2025, 2026].map(y => (
                      <MenuItem key={y} value={y}>{y}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Grid container spacing={4}>
              {/* Summary Cards and Charts - Left Side on Large Screens */}
              <Grid item xs={12} lg={4} xl={3}>
                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <ExpenseSummary year={filterYear} month={filterMonth} refreshTrigger={filteredExpenses} />
                    <Box sx={{ flexGrow: 1, minHeight: 400 }}>
                        <ExpenseChart data={filteredExpenses} />
                    </Box>
                 </Box>
              </Grid>

              {/* Expense List - Right Side on Large Screens */}
              <Grid item xs={12} lg={8} xl={9}>
                <ExpenseList 
                  expenses={filteredExpenses} 
                  refresh={refreshExpenses} 
                  onEdit={handleEdit}
                />
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>

      {/* FAB to Add Expense */}
      <Fab 
        color="primary" 
        aria-label="add" 
        sx={{ position: 'fixed', bottom: 32, right: 32, boxShadow: theme.shadows[10] }}
        onClick={() => {
            setEditingExpense(null);
            setOpenForm(true);
        }}
      >
        <AddIcon />
      </Fab>

      {/* Add/Edit Expense Dialog */}
      <Dialog 
        open={openForm} 
        onClose={handleCloseForm}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
            <Typography variant="h6">{editingExpense ? 'Edit Transaction' : 'New Transaction'}</Typography>
            <IconButton onClick={handleCloseForm} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
            <ExpenseForm 
                refresh={refreshExpenses} 
                editingExpense={editingExpense} 
                onCancelEdit={handleCloseForm}
            />
        </DialogContent>
      </Dialog>
    </Box>
  );
}