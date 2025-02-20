import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import Navbar from "../../Navbar/Navbar";
import UserDetailModal from "./Modal/UserDetailModal";

function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      username: "JohnDoe",
      role: "Admin",
      vendors: "Vendor A",
      active: true,
    },
    {
      id: 2,
      username: "JaneSmith",
      role: "User",
      vendors: "Vendor B",
      active: false,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false); // State to manage modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // State to store selected user
  const [isEditing, setIsEditing] = useState(false); // Flag to check if it's add or edit

  const handleAddUser = () => {
    setIsEditing(false); // Set to false to indicate adding a new user
    setSelectedUser(null); // Pass null as there is no user selected
    setModalOpen(true);
  };

  const handleOpenModal = (user) => {
    setIsEditing(true); // Set to true as we're editing
    setSelectedUser(user); // Pass the selected user data to the modal
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div>
      <Navbar />
      <Box sx={{ p: 2 }}>
        <Box display="flex" justifyContent="flex-start" mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddUser} // Handle add user button click
            sx={{ textTransform: "none" }}
          >
            Add User
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
            backgroundColor: "#fff",
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Username
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Role
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Vendor(s)
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Active
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={24} sx={{ color: "#5c6bc0" }} />
                  </TableCell>
                </TableRow>
              ) : users?.length > 0 ? (
                users.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>{row.vendors}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: row.active ? "success.main" : "error.main",
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: row.active ? "success.main" : "error.main",
                          }}
                        />
                        {row.active ? "Active" : "Inactive"}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            "&:hover": { backgroundColor: "#e3f2fd" },
                          }}
                          onClick={() => handleOpenModal(row)} // Open modal to edit user
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            "&:hover": { backgroundColor: "#ffcdd2" },
                          }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ fontStyle: "italic", color: "#757575" }}
                  >
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal for viewing user details */}
        <UserDetailModal
          open={modalOpen}
          onClose={handleCloseModal} // Pass handleCloseModal
          onSave={(updatedData) => {
            // Save logic
            console.log("Saved data:", updatedData);
            handleCloseModal(); // Close modal after saving
          }}
          user={selectedUser} // Pass selected user to modal
          isEditing={isEditing} // Indicate if it's an edit or add action
        />
      </Box>
    </div>
  );
}

export default Users;
