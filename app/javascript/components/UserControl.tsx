import React from "react"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import CloudDoneIcon from '@material-ui/icons/CloudDone';

interface Props {
  username:string,
  //onSubmitAttempt: (username:string) => void
}
interface State {
  editTextField:string,
  error: boolean,
  isLoaded: boolean,
}

class UserControl extends React.Component<Props,State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
        editTextField : "",
        isLoaded: false,
        error: false,
    }
  }
  isInvalidUsername (candidate:string):boolean {
    const regexBad = !/^\w+$/.test(candidate);
    const short = candidate.length < 10;
    return regexBad || short;
  }
  checkUserName(){
    const url = "https://api.example.com/items" //TODO: Change this
    fetch(url)
      .then(res => res.json)
      .then(
        (results) => {
          //TODO
        },
        (error) => {
          //TODO
        }
      )
  }
  render () {
    const state =this.state;
    const paperStyle = {
      padding: "4px", 
      margin: "2px", 
      display:"flex", 
      alignItems:"safe center"
    }
    const isDefault:boolean = this.props.username == "default";
    
    const handleTextbox = (e: { target: { value: string; }; }) => {
      let newInput:string = e.target.value;
      this.setState({editTextField: newInput});
    }
    const dialogIsBad = this.isInvalidUsername(state.editTextField);
    const avaliableUserName = state.isLoaded && !state.error;
    const usernameGroupStyle = {
      flex: 3, //Test this out, by making the text and tags very long
      display:"flex", 
      alignItems:"safe center"
    }
    const textStyle = {
      margin: "4px",
      flex: 2,
    }
    const checkGroupStyle = {
      flex: 1,
      margin: "4px",
    }
    const submitStyle = {
      flex: 1,
      marginLeft: "auto",
      marginRight: "auto",
    }
    return (
      <Paper style={paperStyle}>
        {isDefault &&
          <div style={usernameGroupStyle}>
          <TextField
            style={textStyle}
            margin="dense"
            id="username-field"
            label="New Username"
            fullWidth 
            value={state.editTextField}
            onChange={handleTextbox}
            error={dialogIsBad}
            helperText="Username is invalid"
          />
          <Button disabled={dialogIsBad} style={checkGroupStyle}>Check</Button>
          </div>
        }
        <Button disabled={true} style={submitStyle}>{isDefault ? "Create User" : "Save"}</Button>
      </Paper>
    );
  }
}

export default UserControl
