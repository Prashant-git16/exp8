import API from "./api";
import React, { useState } from "react";

import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress
} from "@mui/material";
import { useForm } from "react-hook-form";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);

  



const onSubmit = async (data) => {
  setLoading(true);
  setAuthStatus(null);

  try {
    const res = await API.post("/api/login", data);

    const token = res.data.token;

    // store token
    localStorage.setItem("token", token);

    // decode role
    const payload = JSON.parse(atob(token.split(".")[1]));
    localStorage.setItem("role", payload.role);

    setAuthStatus({ type: "success", message: "Login successful!" });

    // redirect
    if (payload.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/profile";
    }

  } catch (err) {
    setAuthStatus({ type: "error", message: "Invalid credentials" });
  } finally {
    setLoading(false);
  }
};
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Login Form
        </Typography>

        {authStatus && (
          <Alert severity={authStatus.type}>
            {authStatus.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email"
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters"
              }
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm;