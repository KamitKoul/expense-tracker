import { Paper, Typography, Box, LinearProgress } from "@mui/material";
import BoltIcon from '@mui/icons-material/Bolt';

export default function SpendingPrediction({ currentSpending, month, year }) {
  // Ensure currentSpending is a valid number
  if (typeof currentSpending !== 'number' || isNaN(currentSpending)) {
    return null;
  }
  
  const daysInMonth = (y, m) => new Date(y, m, 0).getDate();
  const today = new Date();
  
  // Only calculate if the viewing month is the current month
  const isCurrentMonth = today.getMonth() + 1 === month && today.getFullYear() === year;
  
  if (!isCurrentMonth) return null;

  const currentDay = today.getDate();
  if (currentDay === 0) return null; // Avoid division by zero

  const totalDays = daysInMonth(year, month);
  const dailyAverage = currentSpending / currentDay;
  const predictedTotal = dailyAverage * totalDays;
  const percentageOfDays = (currentDay / totalDays) * 100;

  return (
    <Paper 
        elevation={0} 
        sx={{ 
            p: 3, 
            borderRadius: 4, 
            bgcolor: '#1e293b', 
            color: 'white',
            overflow: 'hidden',
            position: 'relative'
        }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <BoltIcon sx={{ color: '#f59e0b' }} />
            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
                Smart Prediction
            </Typography>
        </Box>
        
        <Typography variant="body2" sx={{ opacity: 0.7, mb: 1 }}>
            Based on your spending in the first {currentDay} days, you are projected to spend:
        </Typography>
        
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            ₹{Math.round(predictedTotal).toLocaleString()}
        </Typography>

        <Box sx={{ width: '100%', mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>Month Progress</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>{Math.round(percentageOfDays)}%</Typography>
            </Box>
            <LinearProgress 
                variant="determinate" 
                value={percentageOfDays} 
                sx={{ 
                    height: 6, 
                    borderRadius: 3, 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': { bgcolor: '#2563eb' }
                }} 
            />
        </Box>
      </Box>
      
      {/* Decorative pulse */}
      <Box sx={{
        position: 'absolute',
        top: -10,
        right: -10,
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(37,99,235,0) 70%)',
        animation: 'pulse 3s infinite'
      }} />
      
      <style>{`
        @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 0.8; }
            100% { transform: scale(0.8); opacity: 0.5; }
        }
      `}</style>
    </Paper>
  );
}