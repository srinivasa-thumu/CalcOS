import { Box, Container, Stack, Typography } from '@mui/material';

interface CalculatorPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function CalculatorPageLayout({
  title,
  description,
  children,
}: CalculatorPageLayoutProps) {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          py: {
            xs: 3,
            sm: 5,
            md: 8,
          },
        }}
      >
        <Stack spacing={4}>
          <Box>
            <Typography
              component="h1"
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: {
                  xs: '2rem',
                  sm: '2.5rem',
                },
              }}
            >
              {title}
            </Typography>

            <Typography color="text.secondary">
              {description}
            </Typography>
          </Box>

          {children}
        </Stack>
      </Box>
    </Container>
  );
}