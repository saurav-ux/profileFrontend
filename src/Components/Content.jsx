import React, { useState, useEffect } from "react";
import { Grid, Card, Typography, Pagination, Box } from "@mui/material";
import Form from "react-bootstrap/Form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import "bootstrap/dist/css/bootstrap.min.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";


import {
  useSearchDataQuery,
  useDomainDataQuery,
  useGenderDataQuery,
} from "../Services/profileApi";

const Content = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [avail, setAvail] = useState("");
  const [gender, setGender] = useState("");
  const [domain, setDomain] = useState("");
  const pageSize = 20;

  const param = {
    page: currentPage,
    search: search,
    avail: avail,
    gender: gender,
    domain: domain,
  };

  const { data: profileData, isLoading, isError } = useSearchDataQuery(param);
  const { data: domainData } = useDomainDataQuery();
  const { data: genderData } = useGenderDataQuery();

  useEffect(() => {
    if (profileData) {
      setTotalPages(Math.ceil(profileData.totalCount / pageSize));
    }
  }, [profileData, search, avail, domain, gender, currentPage]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleAvail = (e) => {
    if (e.target.value === "yes") {
      setAvail(true);
    } else {
      setAvail(false);
    }
  };

  return (
    <div className="app-container">
      {/* ------------------ Controls Section ------------------ */}
      <div className="controls-wrapper">
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          style={{ fontWeight: "bold", color: "#2d3748", marginBottom: "25px" }}
        >
          Team Directory
        </Typography>

        {/* Search Bar */}
        <div className="search-section">
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search by name..."
              aria-label="Search"
              className="search-input"
              onChange={handleChange}
            />
          </Form>
        </div>

        {/* Filter Bar */}
        <div className="filter-container">
          <div className="filter-item">
            <Autocomplete
              disablePortal
              fullWidth
              size="small"
              id="combo-box-gender"
              options={genderData || []}
              getOptionLabel={(data) => data?.gender || ""}
              onChange={(event, value) => {
                if (value && value.gender === null) setGender("");
                else if (value && value.gender) setGender(value.gender);
                else setGender("");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter by Gender"
                  variant="outlined"
                />
              )}
            />
          </div>

          <div className="filter-item">
            <Autocomplete
              disablePortal
              fullWidth
              size="small"
              id="combo-box-domain"
              options={domainData || []}
              getOptionLabel={(data) => data?.domain || ""}
              onChange={(event, value) => {
                if (value && value.domain === null) setDomain("");
                else if (value && value.domain) setDomain(value.domain);
                else setDomain("");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Filter by Domain"
                  variant="outlined"
                />
              )}
            />
          </div>

          <div className="filter-item radio-group-container">
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="availability"
                name="row-radio-buttons-group"
                onChange={handleAvail}
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio size="small" />}
                  label="Available"
                />
                <FormControlLabel
                  value="no"
                  control={<Radio size="small" />}
                  label="Not Available"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      </div>

      {/* ------------------ Status Messages ------------------ */}
      {isError && (
        <Typography variant="h6" className="no-results" color="error">
          Something went wrong while fetching data.
        </Typography>
      )}

      {isLoading && (
        <Typography variant="h6" className="no-results">
          Loading profiles...
        </Typography>
      )}

      {!isLoading && !isError && profileData?.data.length === 0 && (
        <div className="no-results">
          <h4>No profiles found matching your criteria.</h4>
        </div>
      )}

      {/* ------------------ Grid Content ------------------ */}
      <Grid container spacing={3}>
        {profileData?.data?.map((row) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={row._id}>
            <Card className="profile-card" elevation={2}>
              <div className="avatar-wrapper">
                <img
                  src={row.avatar}
                  alt={`${row.first_name} avatar`}
                  className="avatar-img"
                />
              </div>

              <div className="card-content" style={{ textAlign: "center" }}>
                <Typography variant="h6" className="user-name">
                  {row.first_name} {row.last_name}
                </Typography>

                <Typography variant="body2" className="user-email">
                  {row.email}
                </Typography>

                <Box mt={1} mb={1}>
                  <span className="info-chip">{row.gender}</span>
                  <span className="info-chip">{row.domain}</span>
                </Box>

                <div
                  className={`status-badge ${
                    row.available ? "status-available" : "status-unavailable"
                  }`}
                >
                  {row.available ? "Available" : "Busy"}
                </div>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ------------------ Pagination ------------------ */}
      {!isLoading && profileData?.data.length > 0 && (
        <Box className="pagination-wrapper">
          <Pagination
            count={profileData?.totalPages || totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            color="primary"
            size="large"
          />
        </Box>
      )}
    </div>
  );
};

export default Content;
