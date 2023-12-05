import React from "react";
import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import AddTeam from "./AddTeam";
import { Button } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
const Navbarr = () => {
  const [openAddModel, setOpenAddModel] = useState(false);
  const navigate = useNavigate();
  const handleClick = () => {
    setOpenAddModel(true);
  };

  const handleBotton = () => {
    navigate("/team");
  };

  return (
    <div>
      <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
        <Container fluid>
          <Navbar.Brand href="/">Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Button variant="contained" color="primary" onClick={handleClick}>
                Add Teams
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleBotton}
                style={{ marginLeft: "20px" }}
              >
                Show Teams
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AddTeam openAddModel={openAddModel} setOpenAddModel={setOpenAddModel} />
    </div>
  );
};

export default Navbarr;
