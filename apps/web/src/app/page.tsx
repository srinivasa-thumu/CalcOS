import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from '@mui/material';

const calculators = [
  {
    title: 'Simple Interest Calculator',
    description:
      'Calculate simple interest and the total amount using principal, interest rate and time.',
    href: '/calculators/simple-interest',
  },
  {
    title: 'Compound Interest Calculator',
    description:
      'Calculate compound interest with annual, semi-annual, quarterly, monthly or daily compounding.',
    href: '/calculators/compound-interest',
  },
];

export default function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={6}>
          <Box
            sx={{
              maxWidth: 760,
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
              sx={{
                mt: 2,
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Simple, accurate and easy-to-use financial calculators for
              everyday calculations.
            </Typography>
          </Box>

          <Box>
            <Typography
              component="h2"
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 3,
              }}
            >
              Calculators
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, 1fr)',
                },
                gap: 3,
              }}
            >
              {calculators.map((calculator) => (
                <Card key={calculator.href}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Typography
                        component="h3"
                        variant="h5"
                        sx={{ fontWeight: 700 }}
                      >
                        {calculator.title}
                      </Typography>

                      <Typography color="text.secondary">
                        {calculator.description}
                      </Typography>

                      <Box>
                        <Button
                          href={calculator.href}
                          variant="contained"
                        >
                          Open Calculator
                        </Button>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}