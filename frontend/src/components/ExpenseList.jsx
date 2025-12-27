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
  Tooltip
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function ExpenseList({ expenses, refresh, onEdit }) {
  const remove = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await API.delete(`/expenses/${id}`);
    refresh();
  };

  return (
    <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h6" sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
        Expense History
      </Typography>
      {expenses.length === 0 ? (
         <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
           No expenses recorded yet.
         </Typography>
      ) : (
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell align="right"><strong>Amount (₹)</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                  <TableCell>
                    {new Date(row.expenseDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      backgroundColor: '#e3f2fd', 
                      color: '#1565c0',
                      fontSize: '0.875rem'
                    }}>
                      {row.category}
                    </span>
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                    {row.amount}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => onEdit(row)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => remove(row._id)} color="error">
                        <DeleteIcon />
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
