import { Paper, Typography, Box, LinearProgress, Grid } from "@mui/material";

export default function CategoryBreakdown({ data }) {
  const categories = data.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const total = Object.values(categories).reduce((a, b) => a + b, 0);
  const sortedCategories = Object.entries(categories)
    .map(([name, value]) => ({ name, value, percentage: (value / total) * 100 }))
    .sort((a, b) => b.value - a.value);

  const colors = {
    Food: '#3b82f6',
    Travel: '#10b981',
    Rent: '#ef4444',
    Shopping: '#f59e0b',
    Other: '#8b5cf6'
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #f0f0f0', height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'text.secondary', mb: 3 }}>
        Category Breakdown
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {sortedCategories.map((cat) => (
          <Box key={cat.name}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" fontWeight="600">{cat.name}</Typography>
              <Typography variant="body2" color="text.secondary">₹{cat.value.toLocaleString()} ({Math.round(cat.percentage)}%)</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={cat.percentage} 
              sx={{ 
                height: 8, 
                borderRadius: 4, 
                bgcolor: '#f1f5f9',
                '& .MuiLinearProgress-bar': { bgcolor: colors[cat.name] || '#94a3b8' }
              }} 
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
