import { Paper, Typography, Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

export default function SmartInsights({ expenses, budget, totalSpent }) {
  const getInsights = () => {
    const insights = [];
    
    if (budget === 0) {
        insights.push({
            text: "Set a monthly budget goal in the sidebar to get better spending insights.",
            icon: <InfoIcon color="info" />,
            color: "info.main"
        });
    }

    if (budget > 0) {
        if (totalSpent > budget) {
            insights.push({
                text: "You have exceeded your monthly budget. Consider reviewing your non-essential expenses.",
                icon: <WarningIcon color="error" />,
                color: "error.main"
            });
        } else if (totalSpent > budget * 0.8) {
            insights.push({
                text: "You've used over 80% of your budget. Slow down on discretionary spending!",
                icon: <WarningIcon color="warning" />,
                color: "warning.main"
            });
        } else {
            insights.push({
                text: "Great job! You're well within your budget limits this month.",
                icon: <CheckCircleIcon color="success" />,
                color: "success.main"
            });
        }
    }

    // Category based insight
    const categories = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});

    const topCategory = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b, null);
    
    if (topCategory) {
        insights.push({
            text: `Your highest spending is on "${topCategory}". Is there a way to optimize this?`,
            icon: <LightbulbIcon color="secondary" />,
            color: "secondary.main"
        });
    }

    return insights;
  };

  const insights = getInsights();

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #f0f0f0', mt: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        Smart Insights
      </Typography>
      <List disablePadding>
        {insights.map((insight, index) => (
          <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              {insight.icon}
            </ListItemIcon>
            <ListItemText 
                primary={insight.text} 
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500, color: 'text.primary' }} 
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
