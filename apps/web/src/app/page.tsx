import { Box, Button, Container, Stack, Typography } from '@mui/material';

export default function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          py: { xs: 6, md: 10 },
        }}
      >
        <Stack
          spacing={3}
          sx={{
            maxWidth: 720,
          }}
        >
          <Typography
            component="h1"
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: '2.25rem',
                md: '3.5rem',
              },
            }}
          >
            Financial calculations, made simple.
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 400, lineHeight: 1.6 }}
          >
            Simple and compound interest calculators designed to be fast,
            accurate and easy to understand.
          </Typography>

          <Box>
            <Button
              href="/calculators/simple-interest"
              variant="contained"
              size="large"
            >
              Simple Interest Calculator
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}