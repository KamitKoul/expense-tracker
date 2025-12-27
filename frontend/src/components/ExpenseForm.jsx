import { useState } from "react";
import API from "../api";
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Grid, 
  Paper, 
  Typography,
  Box
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

export default function ExpenseForm({ refresh, editingExpense, onCancelEdit }) {
  const getToday = () => new Date().toISOString().split('T')[0];

  const [form, setForm] = useState(editingExpense ? {
    title: editingExpense.title,
    amount: editingExpense.amount,
    category: editingExpense.category,
    expenseDate: new Date(editingExpense.expenseDate).toISOString().split('T')[0]
  } : {
    title: "",
    amount: "",
    category: "Food",
    expenseDate: getToday()
  });

  const submit = async () => {
    // Basic validation
    if (!form.title || !form.amount) return alert("Please fill all fields");

    try {
      if (editingExpense) {
          await API.put(`/expenses/${editingExpense._id}`, {
              ...form,
              amount: Number(form.amount)
          });
          onCancelEdit();
      } else {
          await API.post("/expenses", {
              ...form,
              amount: Number(form.amount)
          });
      }

      // Reset form if not unmounted or if adding new
      if (!editingExpense) {
          setForm({ title: "", amount: "", category: "Food", expenseDate: getToday() });
      }
      refresh();
    } catch (error) {
      console.error("Error saving expense", error);
      alert("Failed to save expense");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {editingExpense ? <><EditIcon /> Edit Expense</> : <><AddCircleIcon /> Add Expense</>}
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            type="number"
            label="Amount"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={form.category}
              label="Category"
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              {["Food", "Travel", "Rent", "Shopping", "Other"].map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={form.expenseDate}
            onChange={e => setForm({ ...form, expenseDate: e.target.value })}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
             {editingExpense && (
              <Button 
                variant="outlined" 
                color="secondary" 
                startIcon={<CancelIcon />}
                onClick={() => {
                  onCancelEdit();
                }}
              >
                Cancel
              </Button>
            )}
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={editingExpense ? <EditIcon /> : <AddCircleIcon />}
              onClick={submit}
            >
              {editingExpense ? "Update Expense" : "Add Expense"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}