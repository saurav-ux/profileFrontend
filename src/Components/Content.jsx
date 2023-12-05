import React from "react";
import { useState, useEffect } from "react";
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
  useGetTeamDataQuery
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
  //------------------RTK Query fetch---------------------
  const { data: profileData, isLoading, isError } = useSearchDataQuery(param);
  const { data: domainData } = useDomainDataQuery();
  const { data: genderData } = useGenderDataQuery();
  // console.log("searh", searchData);

  useEffect(
    () => {
      if (profileData) {
        setTotalPages(Math.ceil(profileData.totalCount / pageSize));
      }
    },
    [profileData],
    [search],
    [avail],
    [domain],
    [gender],
    [currentPage]
  );

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
    console.log(e.target.value);
  };

  const handleAvail = (e) => {
    console.log("ecv", e.target.value);
    if (e.target.value === "yes") {
      setAvail(true);
    } else {
      setAvail(false);
    }
  };

  return (
    <div style={{ margin: 25 }}>
      <br /> <br /> <br />
      {/* //----------------------search bar------------------------------------// */}
      <Form className="d-flex">
        <Form.Control
          type="search"
          placeholder="Search"
          //  className="me-2"
          aria-label="Search"
          onChange={handleChange}
        />
      </Form>
      <br /> <br />
      {/* //----------------------Filter bar------------------------------------// */}
      <div className="filter">
        <div className="filter1a">
          <Autocomplete
            sx={{ width: 300 }}
            disablePortal
            fullWidth
            id="device_group_name"
            name="Gender"
            options={genderData || []}
            getOptionLabel={(data) => data?.gender || ""}
            onChange={(event, value) => {
              console.log("value", value);
              if (value && value.gender === null) {
                setGender("");
              } else if (value && value.gender) {
                setGender(value.gender);
              }
            }}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                {option.gender}
              </Box>
            )}
            renderInput={(params) => <TextField {...params} label="Gender" />}
          />
        </div>
        <div className="filter1a">
          <Autocomplete
            sx={{ width: 300 }}
            disablePortal
            fullWidth
            id="device_group_name"
            name="Gender"
            options={domainData || []}
            getOptionLabel={(data) => data?.domain || ""}
            onChange={(event, value) => {
              console.log("value", value);
              if (value && value.domain === null) {
                setDomain("");
              } else if (value && value.domain) {
                setDomain(value.domain);
              }
            }}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id}>
                {option.domain}
              </Box>
            )}
            renderInput={(params) => <TextField {...params} label="Domain" />}
          />
        </div>
        <div className="filter1a">
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
            >
              <FormControlLabel
                value="yes"
                control={<Radio />}
                label="Available"
                onChange={handleAvail}
              />
              <FormControlLabel
                value="no"
                control={<Radio />}
                label="Not Available"
                onChange={handleAvail}
              />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      <br />
      {profileData?.data.length !== 0 ? (
        ""
      ) : (
        <h4 style={{ textAlign: "center" }}>No Matching</h4>
      )}
      <br />
      {isError && (
        <Typography variant="h6" style={{ textAlign: "center" }}>
          Something went wrong...
        </Typography>
      )}
      {isLoading && (
        <Typography variant="h6" style={{ textAlign: "center" }}>
          Loading...
        </Typography>
      )}
      {/* //---------------------------------Profile Area---------------------------// */}
      <Grid container spacing={3}>
        {profileData?.data?.map((row) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={row._id}>
            <Card sx={{ p: 1, borderRadius: 8, boxShadow: 4 }}>
              <div style={{ textAlign: "center" }}>
                <img
                  src={row.avatar}
                  alt=""
                  style={{ width: "30%", borderRadius: "50%" }}
                />
              </div>
              <div style={{ marginTop: 12 }}>
                <Typography variant="h6" align="center">
                  {row.first_name} {row.last_name}
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="textSecondary"
                >
                  Email: {row.email}
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="textSecondary"
                >
                  Gender: {row.gender}
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="textSecondary"
                >
                  Domain: {row.domain}
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  color="textSecondary"
                >
                  Available: {row.available ? "True" : "False"}
                </Typography>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
      <br />
      <br />
      {isLoading ? (
        ""
      ) : (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={profileData?.totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            color="secondary"
          />
        </Box>
      )}
    </div>
  );
};

export default Content;
