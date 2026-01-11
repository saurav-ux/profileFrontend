import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Autocomplete,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Paper,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router-dom";

import {
  useDomainDataQuery,
  useAddTeamDataQuery,
  useAddTeamMutation,
  useGetTeamDataQuery,
} from "../Services/profileApi";

const AddTeam = ({ openAddModel, setOpenAddModel }) => {
  /* ---------------- State ---------------- */
  const [teamName, setTeamName] = useState("");
  const [domain, setDomain] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // For API Optimization
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Snackbar State
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  /* ---------------- API Hooks ---------------- */
  // Only fetch available users.
  // We pass 'true' for avail implicitly via the API query logic or keep it strict here.
  const queryParams = {
    search: debouncedSearch,
    domain: domain,
    avail: true,
  };

  const { data: profileData, isLoading } = useAddTeamDataQuery(queryParams, {
    skip: !openAddModel, // Don't fetch if modal is closed
  });

  const { data: domainData } = useDomainDataQuery();
  const { refetch: refetchTeams } = useGetTeamDataQuery();
  const [addTeamMutation, { isLoading: isSubmitting }] = useAddTeamMutation();

  /* ---------------- Effects ---------------- */
  // Debounce Search Input (500ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset form when modal closes
  const handleClose = () => {
    setOpenAddModel(false);
    setTimeout(() => {
      setTeamName("");
      setDomain("");
      setSearch("");
      setSelectedMembers([]);
    }, 200); // Wait for animation
  };

  /* ---------------- Computed Data ---------------- */
  // Filter out users who are already selected so they don't appear in the "Add" list
  const availableCandidates = useMemo(() => {
    if (!profileData?.data) return [];

    return profileData.data.filter(
      (user) => !selectedMembers.some((member) => member._id === user._id)
    );
  }, [profileData, selectedMembers]);

  /* ---------------- Handlers ---------------- */
  const handleAddMember = (user) => {
    // Optional: Business Rule - Check if domains match (if required)
    // if (domain && user.domain !== domain) {
    //   showToast("User domain does not match team domain", "warning");
    //   return;
    // }
    setSelectedMembers((prev) => [...prev, user]);
  };

  const handleRemoveMember = (id) => {
    setSelectedMembers((prev) => prev.filter((m) => m._id !== id));
  };

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleSubmit = async () => {
    // 1. Validation
    if (!teamName.trim()) {
      showToast("Please enter a Team Name", "error");
      return;
    }
    if (selectedMembers.length === 0) {
      showToast("Please add at least one member", "error");
      return;
    }

    // 2. Prepare Payload
    const payload = {
      teamName: teamName,
      members: selectedMembers, // Backend likely expects array of IDs or Objects
    };

    // 3. API Call
    try {
      await addTeamMutation([payload]).unwrap();

      showToast("Team created successfully!", "success");
      refetchTeams(); // Update the dashboard
      navigate("/team");
      handleClose();
    } catch (error) {
      console.error(error);
      showToast("Failed to create team. Try again.", "error");
    }
  };

  return (
    <>
      <Dialog
        open={openAddModel}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        {/* Custom Header */}
        <div className="dialog-header">
          <Typography variant="h6" style={{ fontWeight: 600 }}>
            Create New Team
          </Typography>
          <IconButton onClick={handleClose} style={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </div>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* --- Form Section --- */}
            <Box display="flex" gap={2} flexWrap="wrap">
              <TextField
                label="Team Name"
                variant="outlined"
                fullWidth
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                sx={{ flex: 1, minWidth: "250px" }}
              />

              <Autocomplete
                options={domainData || []}
                getOptionLabel={(option) => option?.domain || ""}
                onChange={(e, value) => setDomain(value?.domain || "")}
                sx={{ flex: 1, minWidth: "250px" }}
                renderInput={(params) => (
                  <TextField {...params} label="Filter Domain (Optional)" />
                )}
              />
            </Box>

            {/* --- Selected Members Section --- */}
            {selectedMembers.length > 0 && (
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#f8f9fa" }}>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  Selected Members ({selectedMembers.length})
                </Typography>
                <TableContainer sx={{ maxHeight: 200 }}>
                  <Table size="small" stickyHeader>
                    <TableBody>
                      {selectedMembers.map((row) => (
                        <TableRow key={row._id}>
                          <TableCell sx={{ fontWeight: 500 }}>
                            {row.first_name} {row.last_name}
                          </TableCell>
                          <TableCell>{row.domain}</TableCell>
                          <TableCell align="right">
                            <Button
                              startIcon={<DeleteOutlineIcon />}
                              size="small"
                              color="error"
                              className="btn-remove"
                              onClick={() => handleRemoveMember(row._id)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {/* --- Search & Add Section --- */}
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Add Members
              </Typography>

              <TextField
                placeholder="Search available members by name..."
                fullWidth
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TableContainer className="list-container">
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow className="custom-table-head">
                      <TableCell>Name</TableCell>
                      <TableCell>Domain</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : availableCandidates.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          align="center"
                          sx={{ color: "#718096", py: 3 }}
                        >
                          {search
                            ? "No matching members found"
                            : "No available members found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      availableCandidates.map((row) => (
                        <TableRow key={row._id} hover>
                          <TableCell>
                            {row.first_name} {row.last_name}
                          </TableCell>
                          <TableCell>
                            <Box
                              component="span"
                              sx={{
                                bgcolor: "#edf2f7",
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: "0.75rem",
                              }}
                            >
                              {row.domain}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              className="btn-add"
                              startIcon={<PersonAddIcon />}
                              onClick={() => handleAddMember(row)}
                            >
                              Add
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: "#f7fafc" }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Team"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddTeam;
