import { Paper, Typography, Box, Grid } from "@mui/material";
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PieChartIcon from '@mui/icons-material/PieChart';

export default function AnalyticsSummary({ data }) {
  const total = data.reduce((acc, curr) => acc + curr.amount, 0);
  const count = data.length;
  const average = count > 0 ? total / count : 0;

  const stats = [
    { label: 'Total Volume', value: `₹${total.toLocaleString()}`, icon: <ShowChartIcon />, color: '#2563eb' },
    { label: 'Avg. Transaction', value: `₹${Math.round(average).toLocaleString()}`, icon: <TrendingDownIcon />, color: '#7c3aed' },
    { label: 'Total Records', value: count, icon: <PieChartIcon />, color: '#10b981' }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat) => (
        <Grid item xs={12} md={4} key={stat.label}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: `${stat.color}15`, color: stat.color, borderRadius: 2, display: 'flex' }}>
              {stat.icon}
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
                {stat.label}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {stat.value}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
