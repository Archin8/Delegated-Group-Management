import { Box, Typography, Grid, Paper } from '@mui/material';

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              My Groups
            </Typography>
            {/* Group list will be added here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {/* Activity feed will be added here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 