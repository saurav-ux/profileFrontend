import React from "react";
import { Grid, Card, Typography, Box } from "@mui/material";
import { useGetTeamDataQuery } from "../Services/profileApi";


const ShowTeam = () => {
  const { data: profileData, isLoading, isError } = useGetTeamDataQuery();

  if (isLoading) {
    return (
      <div className="team-page-container">
        <Typography variant="h6" align="center" className="state-message">
          Loading Teams...
        </Typography>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="team-page-container">
        <Typography
          variant="h6"
          align="center"
          color="error"
          className="state-message"
        >
          Something went wrong while fetching teams.
        </Typography>
      </div>
    );
  }

  if (!profileData || profileData.length === 0) {
    return (
      <div className="team-page-container">
        <Typography variant="h5" align="center" className="state-message">
          No Teams Available
        </Typography>
      </div>
    );
  }

  return (
    <div className="team-page-container" style={{ marginTop: "40px" }}>
      {profileData.map((team, index) => (
        <Box key={team._id || index} sx={{ mb: 6 }}>
          {/* Professional Team Header */}
          <div className="team-header-row">
            <Typography variant="h4" className="team-title-text">
              {team.teamName}
            </Typography>
          </div>

          {/* Using your requested Grid structure */}
          <Grid container spacing={3}>
            {team.members.map((row) => (
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

                  </div>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </div>
  );
};

export default ShowTeam;
