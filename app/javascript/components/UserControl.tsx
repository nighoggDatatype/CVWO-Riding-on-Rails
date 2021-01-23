import React from "react"
import Paper from "@material-ui/core/Paper"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"

interface Props {
  username:string,
  //onSubmitAttempt: (username:string) => void
}
interface State {
  editTextField:string,
}

class UserControl extends React.Component<Props,State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
        editTextField : "",
    }
  }
  isInvalidUsername (candidate:string):boolean {
    const regexBad = !/^\w+$/.test(candidate);
    const short = candidate.length < 10;
    return regexBad || short;
  }
  render () {
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
    const dialogIsBad = this.isInvalidUsername(this.state.editTextField);
    return (
      <Paper style={paperStyle}>
        {isDefault &&
          <div>
          <TextField
            margin="dense"
            id="username-field"
            label="New Username"
            fullWidth 
            value={this.state.editTextField}
            onChange={handleTextbox}
            error={dialogIsBad}
            helperText="Username is invalid"
          />
          <Button disabled={dialogIsBad}>Check</Button>
          </div>
        }
        <Button disabled={true}>{isDefault ? "Create User" : "Save"}</Button>
      </Paper>
    );
  }
}

export default UserControl
