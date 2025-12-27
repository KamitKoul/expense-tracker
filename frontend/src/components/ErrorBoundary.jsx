import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            p: 4 
          }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              maxWidth: 500, 
              borderRadius: 4,
              border: '1px solid #fee2e2'
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {this.state.error?.message || "An unexpected error occurred while rendering this component."}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
