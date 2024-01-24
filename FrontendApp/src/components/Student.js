import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Container, Paper, Button } from '@material-ui/core';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const Student = () => {
  const paperStyle = { padding: '50px 20px', width: 600, margin: '20px auto' };
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [students, setStudents] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); 
  const isFirstGetStudentRef = React.useRef(true);
  const classes = useStyles();

  useEffect(() => {
    if (isFirstGetStudentRef.current || formSubmitted) {

      // Set loading to true when starting to fetch data
      setLoading(true);

      fetch('http://localhost:8080/student/getAll')
        .then((res) => res.json())
        .then((data) => {

          // Sort the data array by id in descending order
          const sortedData = [...data].sort((a, b) => b.id - a.id);

          // Update the fetched data state
          setStudents(sortedData);
        })
        .finally(() => {
          // Reset the formSubmitted state
          setFormSubmitted(false);

          // Set loading to false when data fetching is complete
          setLoading(false);
        });
    }

    isFirstGetStudentRef.current = false;
  }, [formSubmitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if name or address is empty
    if (!name.trim() || !address.trim()) {
      // Show a warning toast message
      toast.warning('You missed filling out the form. Please check!');
      return; // Stop further processing if the form is not filled
    }
    const student = { name, address };
    fetch('http://localhost:8080/student/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    })
      .then(() => {
        // Show alert message
        toast.success('Success adding new student!');

        // Reset the form states
        setName('');
        setAddress('');

        // Update state to fetch list api
        setFormSubmitted(true);
      })
      .catch((error) => {
        console.error('Error adding student:', error);
        // Show an error toast message
        toast.error('Fail adding student!');
      });
  };

  return (
    <Container>
      <ToastContainer />
      <Paper elevation={3} style={paperStyle}>
        <h1 style={{ color: 'blue' }}>
          <u> Add Student </u>
        </h1>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            id="outlined-basic"
            label="Student Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Student Address"
            variant="outlined"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button variant="contained" color="secondary" onClick={handleSubmit}>
            Submit
          </Button>
        </form>
      </Paper>
      <h1> Students </h1>
      <Paper elevation={3} style={paperStyle}>
        {loading ? (
          <CircularProgress disableShrink />
        ) : (
          students.map((student) => (
            <Paper key={student.id} elevation={6} style={{ margin: '10px', padding: '15px', textAlign: 'left' }}>
              Id: {student.id} <br />
              Name: {student.name} <br />
              Address: {student.address}
            </Paper>
          ))
        )}
      </Paper>
    </Container>
  );
};

export default Student;
