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
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = { done: this.props.done, task: this.props.task, editDialogOpen: false, editTextField : this.props.task}
  }
  render () {
    const done = this.state.done;
    const handleClose = () => this.setState({editDialogOpen: false});
    return (
      <li>
        Id: {this.props.id}, 
        <Checkbox
          checked={this.state.done}
          onClick={() => this.setState((prev) => ({done: !prev.done}))}
        />
        {done ? <s>{this.state.task}</s> : this.state.task}
        {!done &&
        <IconButton onClick={() => this.setState((prev) => ({editDialogOpen: true, editTextField: prev.task}))}>
            <EditIcon/>
        </IconButton>
        }
        <Dialog open={this.state.editDialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth maxWidth='md'>
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
              onChange={(e) => this.setState({editTextField: e.target.value.replace("\n","")})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={() => this.setState((prev) => ({task: prev.editTextField, editDialogOpen: false}))} color="primary">
              Change
            </Button>
          </DialogActions>
        </Dialog>
        Tags: {this.props.tags}
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
