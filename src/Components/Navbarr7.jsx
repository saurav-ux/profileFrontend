import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddTeam from "./AddTeam";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbarr = () => {
  const [openAddModel, setOpenAddModel] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Navbar expand="lg" fixed="top" className="custom-navbar">
        <Container fluid className="navbar-container">
          <Navbar.Brand style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
            className="brand-text"
          >
            Team Manager
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="nav-actions ms-auto">
              <Button
                variant="contained"
                className="nav-btn primary-btn"
                onClick={() => setOpenAddModel(true)}
              >
                Add Team
              </Button>

              <Button
                variant="outlined"
                className="nav-btn secondary-btn"
                onClick={() => navigate("/team")}
              >
                Show Teams
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AddTeam openAddModel={openAddModel} setOpenAddModel={setOpenAddModel} />
    </>
  );
};

export default Navbarr;
