import React from 'react'
import { Grid, Card, Typography } from "@mui/material";
import { useGetTeamDataQuery } from '../Services/profileApi';
const ShowTeam = () => {

    const { data: profileData, isLoading, isError } = useGetTeamDataQuery();
  return (
    <div className='team'>
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
        <Grid container spacing={3}>
        {profileData?.map((row) => (
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
    </div>
  )
}

export default ShowTeam
