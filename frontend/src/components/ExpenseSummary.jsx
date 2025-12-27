import { useEffect, useState } from "react";
import API from "../api";
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box 
} from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function ExpenseSummary({ year, month, refreshTrigger }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Fetch Total for specific month/year
        // Uses the new endpoint that relies on token for user ID
        const res = await API.get(`/expenses/monthly?year=${year}&month=${month}`);
        setTotal(res.data.total);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    fetchSummary();
  }, [year, month, refreshTrigger]);

  return (
    <Card elevation={3} sx={{ mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
            <Typography variant="h6">
              Total Expenses
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h3" fontWeight="bold">
              ₹{total}
            </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}