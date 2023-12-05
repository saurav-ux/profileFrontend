import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Form from "react-bootstrap/Form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Typography, Box } from "@mui/material";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
//import Table from "@mui/material";
import { useFormik } from "formik";
import {
  useDomainDataQuery,
  useAddTeamDataQuery,
  useAddTeamMutation,
  useGetTeamDataQuery
} from "../Services/profileApi";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddTeam = ({ openAddModel, setOpenAddModel }) => {
  //handle snakbar
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [message, setMessage] = useState("Shift Added Successfully");
  const [snakcolor, setSnackColor] = useState("success");
  const { vertical, horizontal, open } = state;
  const [search, setSearch] = useState("");
  const [avail, setAvail] = useState("");
  const [domain, setDomain] = useState("");
  const [addData,setAddData] = useState([])
  console.log("add",addData)

  const param = {
    search: search,
    avail: avail,
    domain: domain,
  };
  //-----------------------RTK Queryfetch-----------------------------
  const { data: profileData, isLoading, isError } = useAddTeamDataQuery(param);
  const { data: domainData } = useDomainDataQuery();
  const{refetch:refetchTeam}= useGetTeamDataQuery()
  const [addteamData] = useAddTeamMutation()

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

  useEffect(() => {}, [profileData], [search], [avail], [domain]);

  const handleClose = () => {
    setOpenAddModel(false);
    setAddData([]);
    setDomain("");
    setAvail("");
    // resetForm()
  };

  const handleCloseSnack = () => {
    setState({ ...state, open: false });
  };

  const handleAdd = (id) => {
    if(domain!==""  && avail!==""){
        const filteredData = profileData?.data.filter(item => item?._id === id);
        setAddData(prevData => [...prevData, ...filteredData]); // Append filteredData to addData
    }
    else{
        setState({ vertical: "top", horizontal: "center", open: true });
        setSnackColor("error");
        setMessage("Please select Domain and Availability");
    }
   
   // console.log("id", filteredData);
  }

  const handleDelete = (id) => {
    const updatedData = addData.filter(item => item._id !== id);
    setAddData(updatedData);
  };

  //------------------SubmitForm starts---------------------
  const handleSubmit = async () => {
    try {
        if(domain!=="" && avail!==""){
            const response = await addteamData(addData);
            if (response.error) {
              setState({ vertical: "top", horizontal: "center", open: true });
              setSnackColor("error");
              setMessage("Unable to add Team");
            }
            if (response?.data) {
              setState({ vertical: "top", horizontal: "center", open: true });
              setSnackColor("success");
              setMessage("Team Added Successfully");
              console.log("response", response);
              setAddData([]);
              setDomain("");
              setAvail("");
              refetchTeam();
              setOpenAddModel(false);
            }
        }
        else{
            setState({ vertical: "top", horizontal: "center", open: true });
            setSnackColor("error");
            setMessage("Please select Domain and Availability");
        }
    
    } catch (error) {
      console.log("Error", error);
      setState({ vertical: "top", horizontal: "center", open: true });
      setSnackColor("error");
      setMessage("Unable to add Team");
    }

   // action.resetForm();
  };
  return (
    <div>
      <div>
        <BootstrapDialog
          onClose={handleClose}
          fullWidth={true}
          maxWidth={"sm"}
          aria-labelledby="customized-dialog-title"
          open={openAddModel}
        >
          <DialogTitle
            sx={{ m: 0, p: 2 }}
            id="customized-dialog-title"
            style={{ backgroundColor: "black", color: "white" }}
          >
            Add Team
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent  dividers style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
            {/* //----------------------search bar------------------------------------// */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={handleChange}
              />
            </Form>
            {/* //----------------------search bar ends------------------------------------// */}
            <br /> <br />
            <form>
            <div className="filterDialog">
              <div className="filter1a">
                <Autocomplete
                  sx={{ width: 200 }}
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
                  renderInput={(params) => (
                    <TextField {...params} label="Domain"  required/>
                  )}
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
                      control={<Radio required />}
                      label="Not Available"
                      onChange={handleAvail}
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
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
           
              {addData.length!==0 ?
                <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Domain</TableCell>
                    <TableCell>Available</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {addData?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body1">
                          {row.first_name} {row.last_name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{row.domain}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {row.available ? "True" : "False"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button variant="contained" color="error" onClick={()=>handleDelete(row?._id)}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
             
              :
              ""
              }
             
            <hr/>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Domain</TableCell>
                  <TableCell>Available</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profileData?.data?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body1">
                        {row.first_name} {row.last_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{row.domain}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {row.available ? "True" : "False"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="success" onClick={()=>handleAdd(row?._id)}>   
                      Add               
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </form>
            </div>
            <div style={{ flexShrink: 0, padding: '10px', borderTop: '1px solid #ddd' }}>
      <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}
       style={{ backgroundColor: "black" }}
      >
        Submit
      </Button>
    </div>
          </DialogContent>
        </BootstrapDialog>

        {/* alert snakbar start */}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={vertical + horizontal}
          open={open}
          autoHideDuration={6000}
          onClose={handleCloseSnack}
        >
          <Alert
            onClose={handleCloseSnack}
            severity={snakcolor}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
        {/* alert snakbar end */}
      </div>
    </div>
  );
};

export default AddTeam;
