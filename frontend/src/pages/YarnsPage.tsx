import { Box, Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import YarnCard from '../entities/yarn/YarnCard';
import type { Yarn } from '../entities/yarn/types';

interface YarnsPageProps {
  yarns: Yarn[];
}

export default function YarnsPage({ yarns }: YarnsPageProps) {
  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Каталог пряжи
        </Typography>

        <Button component={Link} to="/yarns/new" variant="contained">
          Добавить пряжу
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
          },
          gap: 3,
        }}
      >
        {yarns.map((yarn) => (
          <YarnCard key={yarn.id} yarn={yarn} />
        ))}
      </Box>

      {yarns.length === 0 && (
        <Typography color="text.secondary">
          В каталоге пока нет пряжи. Нажмите «Добавить пряжу», чтобы создать первую карточку
        </Typography>
      )}
    </>
  );
}