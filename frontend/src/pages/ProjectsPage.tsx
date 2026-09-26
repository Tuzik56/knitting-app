import { Paper, Typography } from '@mui/material';

export default function ProjectsPage() {
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Проекты
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography>
          Здесь проекты
        </Typography>
      </Paper>
    </>
  );
}