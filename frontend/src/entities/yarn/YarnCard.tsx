import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';

import { Link } from 'react-router-dom';
import type { Yarn } from './types';

interface YarnCardProps {
  yarn: Yarn;
}

export default function YarnCard({ yarn }: YarnCardProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardActionArea
        component={Link}
        to={`/yarns/${yarn.id}`}
        aria-label={`Открыть пряжу ${yarn.name}`}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <Box
          sx={{
            height: 180,
            backgroundColor: yarn.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Typography variant="overline" color="text.secondary">
              {yarn.brand}
            </Typography>

            <Chip label={`${yarn.quantity} шт`} size="small" />
          </Stack>

          <Typography variant="h6" component="h2" gutterBottom>
            {yarn.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {yarn.composition}
          </Typography>

          <Typography variant="body2">
            {yarn.weight} г / {yarn.length} м
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}