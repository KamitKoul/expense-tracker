import { useState, useEffect, useCallback } from "react";
import API from "../api";
import UserSelect from "../components/UserSelect";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseSummary from "../components/ExpenseSummary";
import { Typography, Box, Fade } from "@mui/material";

export default function Expenses() {
  const [userId, setUserId] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpensesData = async (id) => {
    try {
      const res = await API.get(`/expenses/user/${id}`);
      return res.data;
    } catch (error) {
      console.error("Failed to load expenses", error);
      return [];
    }
  };

  useEffect(() => {
    let active = true;
    if (userId) {
      fetchExpensesData(userId).then(data => {
        if (active) setExpenses(data);
      });
    }
    return () => { active = false; };
  }, [userId]);

  const refreshExpenses = useCallback(async () => {
    if (userId) {
      const data = await fetchExpensesData(userId);
      setExpenses(data);
    }
  }, [userId]);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default', p: 2 }}> {/* Changed Container to Box, added full width and background color */}
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        💰 Personal Expense Tracker
      </Typography>

      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}> {/* Added a maxWidth box to center content while allowing full background */}
        <UserSelect onSelect={id => {
          setUserId(id);
          setEditingExpense(null);
          if (!id) setExpenses([]);
        }} />

        {!userId && (
          <Fade in={!userId}>
            <Box sx={{ textAlign: "center", mt: 8, color: "text.secondary" }}>
              <Typography variant="h5" gutterBottom>Welcome!</Typography>
              <Typography>Please select an existing user or create a new one to start tracking expenses.</Typography>
            </Box>
          </Fade>
        )}

        {userId && (
          <Fade in={!!userId}>
            <Box>
              <ExpenseSummary userId={userId} refreshTrigger={expenses} />
              
              <ExpenseForm 
                key={editingExpense ? editingExpense._id : 'new'}
                userId={userId} 
                refresh={refreshExpenses} 
                editingExpense={editingExpense} 
                onCancelEdit={() => setEditingExpense(null)}
              />
              <ExpenseList 
                expenses={expenses} 
                refresh={refreshExpenses} 
                onEdit={setEditingExpense}
              />
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
}
