import React from "react"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import {user_index} from "./Routes";
import BlockIcon from '@material-ui/icons/Block';
import CheckIcon from '@material-ui/icons/Check';

interface Props {
  username:string,
  //onSubmitAttempt: (username:string) => void
}
interface State {
  editTextField:string,
  error: boolean,
  success: boolean,
  isLoaded: boolean,
  isWaiting: boolean,
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
    const avaliableUserName = state.isLoaded && state.success;
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
          <Button disabled={dialogIsBad} style={checkGroupStyle} onClick={this.checkUserName}>Check</Button>
          {this.getValidationIcon(checkGroupStyle)}
          {this.getCloudIcon(checkGroupStyle)}
          </div>
        }
        <Button disabled={!avaliableUserName} style={submitStyle}>{isDefault ? "Create User" : "Save"}</Button>
      </Paper>
    );
  }
}

export default UserControl
