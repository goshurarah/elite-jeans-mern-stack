import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";

const UserEditModal = ({ open, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    username: "",
    role: "",
    password: "",
    repeatPassword: "",
    notifications: {
      asnCreatedEmail: false,
      asnCreatedNotification: false,
    },
  });

  const [errors, setErrors] = useState({
    username: "",
    role: "",
    password: "",
    repeatPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        role: user.role || "",
        password: "",
        repeatPassword: "",
        notifications: {
          asnCreatedEmail: user.notifications?.asnCreatedEmail || false,
          asnCreatedNotification:
            user.notifications?.asnCreatedNotification || false,
        },
      });
    } else {
      setFormData({
        username: "",
        role: "",
        password: "",
        repeatPassword: "",
        notifications: {
          asnCreatedEmail: false,
          asnCreatedNotification: false,
        },
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [name]: checked,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    let formErrors = {};
    if (!formData.username) formErrors.username = "Username is required";
    if (!formData.role) formErrors.role = "Role is required";
    if (formData.password !== formData.repeatPassword)
      formErrors.password = "Passwords must match";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    onSave(formData);
    onClose(); // Close the modal after saving
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          {user ? "Edit User" : "Add User"}
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            fullWidth
            required
            error={Boolean(errors.username)}
            helperText={errors.username}
            margin="normal"
          />

          {/* Role */}
          <FormControl
            fullWidth
            required
            error={Boolean(errors.role)}
            margin="normal"
          >
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="VendorUser">Vendor User</MenuItem>
            </Select>
            {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
          </FormControl>

          {/* Password */}
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            required
            error={Boolean(errors.password)}
            helperText={errors.password}
            margin="normal"
          />

          {/* Repeat Password */}
          <TextField
            label="Repeat Password"
            name="repeatPassword"
            type="password"
            value={formData.repeatPassword}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />

          {/* Notifications */}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            ASN Create Notifications
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.notifications.asnCreatedEmail}
                onChange={handleCheckboxChange}
                name="asnCreatedEmail"
              />
            }
            label="Email"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.notifications.asnCreatedNotification}
                onChange={handleCheckboxChange}
                name="asnCreatedNotification"
              />
            }
            label="Notification"
          />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button onClick={onClose} color="default" sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default UserEditModal;
