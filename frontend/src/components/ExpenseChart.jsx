import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Paper, Typography, Box } from "@mui/material";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function ExpenseChart({ data }) {
  // Aggregate data by category locally if not already done
  const chartData = data.reduce((acc, curr) => {
    const found = acc.find(item => item.name === curr.category);
    if (found) {
      found.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom color="primary">
        Spending by Category
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
