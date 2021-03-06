import React from "react"
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

interface Props {
  actionString:string
  textName:string
  open:boolean
  defaultInput:string
  onSubmit:(text:string)=>void
  onClose:()=>void //TODO: See if I should format this properly to be more like actual onClose
  isValid?:(text:string)=>boolean
  isMultiline:boolean
}
interface State {
  editTextField: string,
  textBoxEnter: boolean,
}

class EditTextDialog extends React.Component<Props,State> {
  handleClose: () => void;
  handleSubmit: () => void;
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
        editTextField : props.defaultInput,
        textBoxEnter : false,
    }
    this.handleClose = () => {
      props.onClose();
      this.setState({editTextField: props.defaultInput})
    }
    this.handleSubmit = () => {
      this.props.onSubmit(this.state.editTextField);
      this.props.onClose();
    }
  }
  
  isInvalidDescription(potentialDescription: string){
    let isGood = true;
    if (this.props.isValid != null){
      isGood = this.props.isValid(potentialDescription);
    }
    let notEmpty = /\S/.test(potentialDescription)
    return !(notEmpty && isGood);
  }
  
  componentDidUpdate(prevProps:Props | Readonly<Props>){
    if(this.props.open && !prevProps.open){
      this.setState({editTextField: this.props.defaultInput})//Properly load default on open
    }
    if(this.state.textBoxEnter){
      this.setState({textBoxEnter : false});
      this.handleSubmit();
    }
  }

  render () {
    const handleTextbox = (e: { target: { value: string; }; }) => {
        let newInputRaw:string = e.target.value;
        let newInput = newInputRaw.replace("\n","");
        let altEnter = !this.isInvalidDescription(newInput) && newInputRaw.includes('\n');
        this.setState({editTextField: newInput, textBoxEnter: altEnter});
    }
    const dialogIsEmpty = this.isInvalidDescription(this.state.editTextField);
    return (
      <Dialog 
        open={this.props.open} 
        onClose={this.handleClose} 
        aria-labelledby="form-dialog-title" 
        fullWidth maxWidth='md'>
        <DialogTitle id="form-dialog-title">{this.props.actionString + " " + this.props.textName}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="task-name-field"
            label={this.props.textName}
            fullWidth 
            multiline
            value={this.state.editTextField}
            rowsMax={this.props.isMultiline ? 7 : 1}
            onChange={handleTextbox}
            error={dialogIsEmpty}
            helperText={`${this.props.textName} cannot be empty`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSubmit} color="primary" disabled={dialogIsEmpty}>
            Change
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default EditTextDialog
