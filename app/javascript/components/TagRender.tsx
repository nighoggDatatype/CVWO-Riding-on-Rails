import React from "react"
import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/Add';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

interface Props {
  tags: string[],
  tagCloud?: string[], //TODO: Strip optional later
  onToggleSearch?: (tag:string) => void, //TODO: Strip optional later
  onChangeTags?: (tag:string[]) => void, //TODO: Strip optional later
};

interface State {
  dialogOpen: boolean,
  searchText: string,
}

class TagRender extends React.Component<Props,State> {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      searchText: "",
    }
  }
  render () {//NOTE: Don't reuse this for tag-cloud management, the interface requirements per tag are deletion, include, exclude, subtag creation, renaming, ect, and its too complex in general
    const handleDelete = (event) => {console.log(event)};//TODO: Make this work properly
    //TODO: Figure out what is the actual way to remotely use setState. Maybe that thing that passes events like onDelete?
    let props = this.props;
    const addCloud: string[] = props.tagCloud.filter(x=>props.tags.indexOf(x)<0);
    const handleClose = () => this.setState({dialogOpen: false, searchText: ""});
    const handleTextbox = (e) => {
      let newInputRaw = e.target.value;
      let newInput = newInputRaw.replace("\n","");
      let altEnter = !this.isInvalidDescription(newInput) && newInputRaw.includes('\n');
      this.setState({editTextField: newInput, textBoxEnter: altEnter});
    }
    const emptySearchResult = false; //TODO: Make search filter for me.

    return (
      <React.Fragment>
        {this.props.tags.map((data) => 
            <Chip
              size="small"
              label={data}
              onClick={() => this.props.onToggleSearch(data)}
              onDelete={handleDelete}
              style={{margin:"4px"}}
            />
        )}
        <Chip 
          variant="outlined" 
          size="small" 
          style={{margin:"4px"}} 
          icon={<AddIcon />} 
          onClick={() => this.setState({dialogOpen: true})}
        />
        <Dialog 
          open={this.state.dialogOpen} 
          onClose={handleClose} 
          aria-labelledby="form-dialog-title" 
          fullWidth maxWidth='md'>
          <DialogTitle id="form-dialog-title">Select New Tag</DialogTitle>
          <DialogContent>
          <TextField
            margin="dense"
            id="search-tag-field"
            label="Search"
            fullWidth
            value={this.state.searchText}
            onChange={handleTextbox}
            error={emptySearchResult}
            helperText="Search result is empty"
          />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSubmit} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary" disabled={dialogIsEmpty}>
              Change
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}
export default TagRender
