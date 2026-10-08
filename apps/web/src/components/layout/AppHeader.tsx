import { AppBar, Button, Container, Stack, Toolbar } from '@mui/material';

export function AppHeader() {
  return (
    <AppBar position="static" color="default" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Stack
            direction="row"
            sx={{
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button
              href="/"
              color="inherit"
              sx={{
                fontSize: '1.25rem',
                fontWeight: 700,
                textTransform: 'none',
              }}
            >
              CalcOS
            </Button>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
              }}
            >
              <Button href="/">
                Home
              </Button>

              <Button href="/history">
                History
              </Button>
            </Stack>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}