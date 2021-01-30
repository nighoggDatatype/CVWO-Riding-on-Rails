import React from "react"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import {todo_app, user_index} from "./Routes";
import BlockIcon from '@material-ui/icons/Block';
import CheckIcon from '@material-ui/icons/Check';
import Divider from '@material-ui/core/Divider';
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

interface Props {
  username:string,
  onNewUser: (username:string) => void,
  onSave: () => void,
  saved: boolean
}
interface State {
  editTextField:string,
  error: boolean,
  success: boolean,
  isLoaded: boolean,
  isWaiting: boolean,
  snackbarOpen: boolean,
}

class UserControl extends React.Component<Props,State> {
  checkUserName(){
    const url = user_index(this.state.editTextField);
    fetch(url)
      .then(
        (results) => {
          this.setState({isLoaded:true, success:results.ok, error:false, isWaiting:false});
        },
        (error) => {
          this.setState({isLoaded:true, success:false, error:true, isWaiting:false});
          console.log(error)
        }
      )
    this.setState({isWaiting:true});
  }
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
        editTextField : "",
        isLoaded: false,
        success: false,
        error: false,
        isWaiting: false,
        snackbarOpen: false,
    }
    this.checkUserName = this.checkUserName.bind(this);
  }
  isInvalidUsername (candidate:string):boolean {
    const regexBad = !/^\w+$/.test(candidate);
    const short = candidate.length < 10;
    return regexBad || short;
  }
  getValidationIcon(style: React.CSSProperties){
    if (this.isInvalidUsername(this.state.editTextField)){
      return (<BlockIcon style={style}/>)
    }else{
      return (<CheckIcon style={style}/>)
    }
  }

  getCloudIcon(style: React.CSSProperties){
    const state = this.state;
    if (state.isWaiting){
      return (<HourglassEmptyIcon style={style}/>)
    } else if (!state.isLoaded) {
      return (<CloudUploadIcon style={style}/>)
    } else if (state.error) {
      return (<CloudOffIcon style={style}/>)
    } else if (state.success) {
      return (<ThumbUpIcon style={style}/>)
    } else {
      return (<ThumbDownIcon style={style}/>)
    }
  }
  render () {
    const state = this.state;
    const saved = this.props.saved;
    const link = todo_app(this.props.username);
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
    const avaliableUserName = state.isLoaded && state.success;
    const usernameGroupStyle = {
      flex: 3, //Test this out, by making the text and tags very long
      display:"flex", 
      alignItems:"safe center",
      justifyContent: "center"
    }
    const textStyle = {
      margin: "4px",
      flex: 5,
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
    const genericStyle = {margin: "4px"}

    let pushToServer = () => {
      if (isDefault){
        this.props.onNewUser(this.state.editTextField);
      }else{
        this.props.onSave();
      }
    }
    pushToServer = pushToServer.bind(this);

    const openSnackbar = () => this.setState({snackbarOpen: true});
    const closeSnackBar = () => this.setState({snackbarOpen: false});
    const copyLink = () => {
      navigator.clipboard.writeText(link)
      openSnackbar();
    }
    const usernameLength = state.editTextField.length;
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
            helperText={usernameLength == 0
              ? "Username cannot be empty"
              : usernameLength < 10
                ? "Username is too short"
                : "Username is invalid"}
          />
          {this.getValidationIcon(checkGroupStyle)}
          <Divider style={genericStyle} orientation="vertical" flexItem />
          <Divider style={genericStyle} orientation="vertical" flexItem />
          <Button disabled={dialogIsBad} style={checkGroupStyle} onClick={this.checkUserName}>Check</Button>
          {this.getCloudIcon(checkGroupStyle)}
          </div>
        }
        {!isDefault &&
        <div style={usernameGroupStyle}>
          <h2 style={genericStyle}>
            {`Username: ${this.props.username}`}
          </h2>
          <Button style={genericStyle} variant="outlined"onClick={copyLink}>
              Copy Link
          </Button>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={this.state.snackbarOpen}
            autoHideDuration={4500}
            onClose={closeSnackBar}
            message="Link copied"
            key={'Snackbar'}
            action={
              <IconButton size="small" aria-label="close" color="inherit" onClick={closeSnackBar}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </div>
        }
        <Divider style={genericStyle} orientation="vertical" flexItem />
        <Divider style={genericStyle} orientation="vertical" flexItem />
        <Button 
          disabled={!avaliableUserName || saved} 
          style={submitStyle} 
          onClick={pushToServer}
        >
          {isDefault 
            ? "Create User" 
            : saved ? "Saved " : "Save Content"}
        </Button>
      </Paper>
    );
  }
}

export default UserControl
