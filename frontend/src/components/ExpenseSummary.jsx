import { useEffect, useState } from "react";
import API from "../api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box 
} from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function ExpenseSummary({ userId, refreshTrigger }) {
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    if (!userId) return;

    const fetchSummary = async () => {
      try {
        // Fetch Monthly Total
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const totalRes = await API.get(`/expenses/user/${userId}/monthly?year=${year}&month=${month}`);
        setMonthlyTotal(totalRes.data.total);

        // Fetch Category Summary
        const catRes = await API.get(`/expenses/user/${userId}/category-summary`);
        // Transform for Recharts: _id is category name, totalSpent is value
        const formattedData = catRes.data.map(item => ({
          name: item._id,
          value: item.totalSpent
        }));
        setCategoryData(formattedData);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    fetchSummary();
  }, [userId, refreshTrigger, currentDate]);

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Monthly Total Card */}
      <Grid item xs={12} md={4}>
        <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography color="textSecondary" gutterBottom>
              Current Month Spending
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
               <AccountBalanceWalletIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
               <Typography variant="h3" component="div" color="primary">
                  ₹{monthlyTotal}
               </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Category Chart */}
      <Grid item xs={12} md={8}>
        <Card elevation={3} sx={{ height: '350px' }}>
          <CardContent sx={{ height: '100%' }}>
            <Typography variant="h6" gutterBottom align="center">
              Expenses by Category
            </Typography>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="textSecondary">No data available for chart</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
