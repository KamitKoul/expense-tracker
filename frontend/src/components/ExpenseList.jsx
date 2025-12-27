import API from "../api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Typography,
  Tooltip,
  Box,
  Chip
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

export default function ExpenseList({ expenses, refresh, onEdit }) {
  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    await API.delete(`/expenses/${id}`);
    refresh();
  };

  const getCategoryColor = (category) => {
      const colors = {
          Food: 'primary',
          Travel: 'secondary',
          Rent: 'error',
          Shopping: 'warning',
          Other: 'default'
      };
      return colors[category] || 'default';
  };

  return (
    <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden', border: '1px solid #f0f0f0', borderRadius: 4 }}>
      <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReceiptLongIcon color="action" />
        <Typography variant="h6">
            Recent Transactions
        </Typography>
      </Box>
      
      {expenses.length === 0 ? (
         <Box sx={{ p: 8, textAlign: 'center' }}>
           <Typography variant="body1" color="text.secondary" gutterBottom>
             No transactions found for this period.
           </Typography>
           <Typography variant="body2" color="text.secondary">
             Click the + button to add a new expense.
           </Typography>
         </Box>
      ) : (
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="expense table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Amount</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {new Date(row.expenseDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500">{row.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                        label={row.category} 
                        size="small" 
                        color={getCategoryColor(row.category)} 
                        variant="soft" // If supported by custom theme, else it falls back or ignores
                        sx={{ fontWeight: 500 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight="bold" color={row.amount > 1000 ? 'error.main' : 'text.primary'}>
                        ₹{row.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => onEdit(row)} size="small" sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => remove(row._id)} size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}