import { Box, Container, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Layout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Navbar />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          textAlign: "center",
          borderTop: "1px solid #E5E7EB",
          bgcolor: "white",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Posh Shop. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};
