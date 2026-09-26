import { Paper, Typography } from '@mui/material';

export default function YarnsPage() {
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Пряжа
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography>
          Здесь пряжа
        </Typography>
      </Paper>
    </>
  );
}