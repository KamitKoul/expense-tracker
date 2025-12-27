import { useState, useEffect, useCallback, useContext } from "react";
import API from "../api";
import AuthContext from "../context/AuthContext";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseSummary from "../components/ExpenseSummary";
import ExpenseChart from "../components/ExpenseChart";
import SpendingTrendChart from "../components/SpendingTrendChart";
import SpendingPrediction from "../components/SpendingPrediction";
import { 
  Typography, 
  Box, 
  Fade, 
  Button, 
  Grid2 as Grid, 
  FormControl, 
  Select, 
  MenuItem,
  IconButton,
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Tooltip,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import ErrorBoundary from "../components/ErrorBoundary";

const drawerWidth = 260;

export default function Expenses() {
  const { user, logout } = useContext(AuthContext);
  const theme = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  
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
    
    const total = filtered.reduce((acc, curr) => acc + curr.amount, 0);
    setTotalSpent(total);
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
    <ErrorBoundary>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: 'border-box', 
              bgcolor: '#1e293b', 
              color: 'white',
              borderRight: 'none'
            },
            display: { xs: 'none', md: 'block' }
          }}
        >
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ p: 0.8, bgcolor: '#2563eb', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1 }}>₹</Typography>
              </Box>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, letterSpacing: -0.5 }}>
                  WalletWise
              </Typography>
          </Box>

          <List sx={{ px: 2 }}>
              {[
                  { text: 'Dashboard', icon: <DashboardIcon />, active: true },
                  { text: 'Transactions', icon: <ReceiptIcon /> },
                  { text: 'Analytics', icon: <BarChartIcon /> },
                  { text: 'Settings', icon: <SettingsIcon /> },
              ].map((item) => (
                  <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                      <ListItemButton 
                          sx={{ 
                              borderRadius: 2,
                              bgcolor: item.active ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                              color: item.active ? '#60a5fa' : 'rgba(255,255,255,0.7)',
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                          }}
                      >
                          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                              {item.icon}
                          </ListItemIcon>
                          <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: item.active ? 600 : 400 }} />
                      </ListItemButton>
                  </ListItem>
              ))}
          </List>

          <Box sx={{ mt: 'auto', p: 3 }}>
              <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 3 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#3b82f6', width: 40, height: 40 }}>{user?.name?.[0]}</Avatar>
                  <Box sx={{ overflow: 'hidden' }}>
                      <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>{user?.name}</Typography>
                      <Typography variant="caption" noWrap sx={{ opacity: 0.5 }}>{user?.email}</Typography>
                  </Box>
              </Box>
              <Button 
                  fullWidth 
                  variant="outlined" 
                  color="inherit" 
                  startIcon={<LogoutIcon />}
                  onClick={logout}
                  sx={{ borderColor: 'rgba(255,255,255,0.2)', '&:hover': { borderColor: 'white' } }}
              >
                  Logout
              </Button>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
          <Fade in={true} timeout={800}>
            <Box>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}>
                  <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: -1 }}>
                          Financial Overview
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#64748b' }}>
                          Track, analyze and predict your expenses.
                      </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'white', p: 1, pr: 2, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, bgcolor: '#f1f5f9', borderRadius: 2 }}>
                          <FilterListIcon sx={{ fontSize: 18, color: '#64748b' }} />
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Filter Period</Typography>
                      </Box>
                      <FormControl variant="standard" sx={{ minWidth: 90 }}>
                          <Select 
                              disableUnderline
                              value={filterMonth} 
                              onChange={(e) => setFilterMonth(e.target.value)}
                              sx={{ fontWeight: 600, fontSize: '0.9rem' }}
                          >
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                  <MenuItem key={m} value={m}>{new Date(0, m-1).toLocaleString('default', { month: 'long' })}</MenuItem>
                              ))}
                          </Select>
                      </FormControl>
                      <FormControl variant="standard" sx={{ minWidth: 70 }}>
                          <Select 
                              disableUnderline
                              value={filterYear} 
                              onChange={(e) => setFilterYear(e.target.value)}
                              sx={{ fontWeight: 600, fontSize: '0.9rem' }}
                          >
                              {[2023, 2024, 2025, 2026].map(y => (
                                  <MenuItem key={y} value={y}>{y}</MenuItem>
                              ))}
                          </Select>
                      </FormControl>
                  </Box>
              </Box>

              <Grid container spacing={4}>
                  {/* Top Row: Summary & Prediction */}
                  <Grid size={{ xs: 12, lg: 8 }}>
                      <ExpenseSummary year={filterYear} month={filterMonth} refreshTrigger={filteredExpenses} />
                  </Grid>
                  <Grid size={{ xs: 12, lg: 4 }}>
                      <SpendingPrediction currentSpending={totalSpent} month={filterMonth} year={filterYear} />
                  </Grid>

                  {/* Middle Row: Trends & Charts */}
                  <Grid size={{ xs: 12, lg: 8 }}>
                      <SpendingTrendChart refreshTrigger={expenses} />
                  </Grid>
                  <Grid size={{ xs: 12, lg: 4 }}>
                      <ExpenseChart data={filteredExpenses} />
                  </Grid>

                  {/* Bottom Row: Transactions */}
                  <Grid size={{ xs: 12 }}>
                      <ExpenseList 
                          expenses={filteredExpenses} 
                          refresh={refreshExpenses} 
                          onEdit={handleEdit}
                      />
                  </Grid>
              </Grid>
            </Box>
          </Fade>
        </Box>

        {/* FAB to Add Expense */}
        <Fab 
          color="primary" 
          aria-label="add" 
          sx={{ position: 'fixed', bottom: 32, right: 32, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)' }}
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
          PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{editingExpense ? 'Edit Transaction' : 'Add New Transaction'}</Typography>
              <IconButton onClick={handleCloseForm} size="small" sx={{ bgcolor: '#f1f5f9' }}><CloseIcon /></IconButton>
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
    </ErrorBoundary>
  );
}
