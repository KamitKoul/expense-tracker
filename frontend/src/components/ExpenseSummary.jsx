import { useEffect, useState } from "react";
import API from "../api";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Skeleton,
  LinearProgress
} from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function ExpenseSummary({ year, month, refreshTrigger, budget }) {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/expenses/monthly?year=${year}&month=${month}`);
        setTotal(res.data.total);
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [year, month, refreshTrigger]);

  const budgetPercentage = budget > 0 ? (total / budget) * 100 : 0;
  const isOverBudget = budget > 0 && total > budget;

  return (
    <Card 
        elevation={0} 
        sx={{ 
            mb: 4, 
            background: isOverBudget ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)', 
            color: 'white',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            transition: 'background 0.5s ease'
        }}
    >
        {/* Decorative circle */}
        <Box sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)'
        }} />

      <CardContent sx={{ position: 'relative', p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                  {isOverBudget ? 'Budget Exceeded' : 'Total Expenses'}
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </Typography>
            </Box>
            <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 32 }} />
            </Box>
        </Box>
        
        <Box sx={{ mt: 3, mb: 3 }}>
            {loading ? (
                <Skeleton variant="text" width="60%" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
            ) : (
                <Typography variant="h2" fontWeight="bold">
                  ₹{total.toLocaleString()}
                </Typography>
            )}
        </Box>

        {budget > 0 && (
            <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 600 }}>Budget Goal: ₹{budget.toLocaleString()}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 600 }}>{Math.round(budgetPercentage)}%</Typography>
                </Box>
                <LinearProgress 
                    variant="determinate" 
                    value={Math.min(budgetPercentage, 100)} 
                    sx={{ 
                        height: 8, 
                        borderRadius: 4, 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        '& .MuiLinearProgress-bar': { 
                            bgcolor: isOverBudget ? '#fca5a5' : '#10b981' 
                        } 
                    }} 
                />
            </Box>
        )}
      </CardContent>
    </Card>
  );
}