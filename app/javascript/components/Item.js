import React from "react"
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from "prop-types"
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import TagRender from "./TagRender";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Divider from '@material-ui/core/Divider';
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = { done: this.props.done, task: this.props.task, editDialogOpen: false, editTextField : this.props.task}
  }
  render () {
    const done = this.state.done;
    const handleOpen = () => this.setState((prev) => ({editDialogOpen: true, editTextField: prev.task}))
    const handleClose = () => this.setState({editDialogOpen: false});
    const handleSubmit = () => this.setState((prev) => ({task: prev.editTextField, editDialogOpen: false}));//TODO: Supress submission if there is no text
    const handleTextbox = (e) => {
        let newInput = e.target.value;
        this.setState({editTextField: newInput.replace("\n","")});
        //TODO: See about setting input of newline to trigger submition
        //See here for reasons: https://stackoverflow.com/questions/30782948/why-calling-react-setstate-method-doesnt-mutate-the-state-immediately
    }
    
    const toggleCheckbox = () => this.setState((prev) => ({done: !prev.done}))
    
    //TODO: Intergrate this into proper css styling
    const paperStyle = {
        padding: "4px", 
        margin: "2px", 
        display:"flex", 
        alignItems:"safe center"
    }
    const genericDivStyle = {margin: "4px"}
    const startOfRightButtons = {
        margin: genericDivStyle.margin,
        marginLeft: "auto"
    }
    const texStyle = {margin: "8px"}//Set this as twice the genericDivStyle when I properly implement this. But this will do for now
    const textGroupStyle = {
        flex: 3, //Test this out, by making the text and tags very long
        display:"flex", 
        alignItems:"safe center"
    }
    const tagStyle = {
        flex: 1, 
        display:"flex", 
        flexWrap: "wrap" //TODO: Test this, by cramming tags until it oveflows
    }
    //NOTE: Try to set trash icon to a danger colour
    const dialogCode = <Dialog 
        open={this.state.editDialogOpen} 
        onClose={handleClose} 
        aria-labelledby="form-dialog-title" 
        fullWidth maxWidth='md'>
            <DialogTitle id="form-dialog-title">Edit Task</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="task-name-field"
                label="Task Description"
                defaultValue= {this.state.task}
                fullWidth 
                multiline
                value={this.state.editTextField}
                rowsMax={7}
                onChange={handleTextbox}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSubmit} color="primary">
                Change
              </Button>
            </DialogActions>
          </Dialog>
    return (
      <li key={this.props.id}>
        <Paper style={paperStyle}>
          <Checkbox checked={this.state.done} onClick={toggleCheckbox} style={genericDivStyle}/>
          <div style={textGroupStyle}>
            <div style={texStyle}>{done ? <s>{this.state.task}</s> : this.state.task}</div>
            {!done && <IconButton onClick={handleOpen} style={genericDivStyle}><EditIcon/></IconButton>}
            {dialogCode}
          </div>
          <Divider style={genericDivStyle} orientation="vertical" flexItem />
          <div style={tagStyle}><TagRender tags={this.props.tags}/></div>
          <Divider style={genericDivStyle} orientation="vertical" flexItem />
          <IconButton style={startOfRightButtons} size='small'><ArrowUpwardIcon/></IconButton>
          <IconButton style={genericDivStyle} size='small'><ArrowDownwardIcon/></IconButton>
          <IconButton style={genericDivStyle} size='small'><DeleteForeverIcon/></IconButton>
        </Paper>
      </li>
    );
  }
}

Item.propTypes = {
  id: PropTypes.number,
  done: PropTypes.bool,
  task: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string)
};
export default Item
