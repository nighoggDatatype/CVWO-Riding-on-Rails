import React from "react"
import Paper from "@material-ui/core/Paper";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Chip from '@material-ui/core/Chip';
import StringToColour from "./StringToColour";
import AddIcon from '@material-ui/icons/Add';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button"

interface Props {
  tagCloud: string[],
  tagSelection: string[],
  //onUpdate: (newTags: {parent:string,tag:string}[], changedTags:{before:string, after:string}[], deletedTags:string[]) => void,
}

interface State {
  //Menu State
  anchor: HTMLElement
  menuFocus: string
  //Generic Dialog State
  dialogOpen: boolean,
  searchText: string,
  searchEnter: boolean,
  //Specific to Tag Creation
  parentDomain: string,
  //Specific to Tag Rename
  originalTag: string,
}

class TagCloud extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      anchor: null, 
      menuFocus: "",
      dialogOpen: false,
      searchText: "",
      searchEnter: false,
      parentDomain: "",
      originalTag: "",
    }
  }
  render () {
    const props = this.props;
    const state = this.state;
    //Style
    const colourfulChipStyle = (data:string) => {
      return {
        margin: "4px",
        backgroundColor: StringToColour(data, false),
        color: StringToColour(data, true)
      }
    }
    //Menu Interactions + Tag Creation
    const handleMenuClickFactory = (data: string) => (event) => {
      this.setState({anchor: event.currentTarget, menuFocus: data});
    };
    const handleCloseMenu = () => {
      this.setState({anchor: null, menuFocus: ""});
    };
    const handleDelete = () => {
      handleCloseMenu(); //TODO: Change this
    }
    const handleRename = () => {
      handleCloseMenu(); //TODO: Change this
    }
    const handleCreate = (isBaseTag:boolean) => () => {
      handleCloseMenu(); //TODO: Change this
    }
    //Dialog Helpers
    const finalTag = state.parentDomain + state.searchText;
    const clash = props.tagCloud.includes(finalTag);
    //Dialog Interaction
    const handleCloseDialog = () => 
      this.setState({dialogOpen: false, searchText: "", parentDomain: "",});
    const handleSearch = () => {}//TODO: Fix this
    return (
      <Paper>
        {props.tagCloud.map((data) => {
          return (
              <Chip
                label={data}
                onDelete={handleMenuClickFactory(data)}
                style={colourfulChipStyle(data)}
                deleteIcon ={<MoreVertIcon/>}
              />
          );
          })}
        <Chip 
          variant="outlined" 
          size="small" 
          style={{margin:"4px"}}
          icon={<AddIcon />} 
          onClick={handleCreate(true)}
        />
        <Menu
          id="simple-menu"
          anchorEl={state.anchor}
          keepMounted
          open={Boolean(state.anchor)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleRename}>Rename</MenuItem>
          <MenuItem onClick={handleCreate(false)}>Create Sub-tag</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
        <Dialog 
          open={state.dialogOpen} 
          onClose={handleCloseDialog} 
          aria-labelledby="form-dialog-title" 
          fullWidth maxWidth='md'>
          <DialogTitle id="form-dialog-title">Select New Tag</DialogTitle>
          <DialogContent>
            {this.searchTags(state.searchText).map((data) => {
                return (
                  <Chip
                    size= { clash ? 'medium' : "small"}
                    label={data}
                    style={colourfulChipStyle(data)}
                    variant={ clash ? 'default' : 'outlined'}
                  />);
              }
            )}
          <TextField
            margin="dense"
            id="search-tag-field"
            label="Search"
            fullWidth
            autoFocus
            multiline
            rowsMax='1'
            value={state.searchText}
            onChange={handleSearch}
            error={clash}
            helperText="Search result is empty"
          />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onSearchSubmitAttempt} color="primary" disabled={clash}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}
export default TagCloud
