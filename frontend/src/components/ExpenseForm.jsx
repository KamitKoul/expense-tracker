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
  Typography,
  Box,
  InputAdornment
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';

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
      if (onCancelEdit) onCancelEdit(); // Close dialog on success
    } catch (error) {
      console.error("Error saving expense", error);
      alert("Failed to save expense");
    }
  };

  return (
    <Box sx={{ pt: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="What did you spend on?"
            placeholder="e.g., Grocery shopping, Netflix subscription"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Amount"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            InputProps={{ 
                startAdornment: <InputAdornment position="start">₹</InputAdornment> 
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
        <Grid item xs={12}>
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
          <Button 
            fullWidth
            variant="contained" 
            size="large"
            startIcon={<SaveIcon />}
            onClick={submit}
            sx={{ height: 48, mt: 2 }}
          >
            {editingExpense ? "Save Changes" : "Add Transaction"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
