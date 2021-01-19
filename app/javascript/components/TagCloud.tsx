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
import ErrorIcon from '@material-ui/icons/Error';

interface Props {
  tagCloud: string[],
  tagSelection: string[],
  onCreate: (parentDomain:string, newName:string) => void,
  onUpdate: (oldFullTagName:string, newLastName:string) => void,
  onDestroy: (deleteTarget:string) => void,
}

interface State {
  //Menu State
  anchor: HTMLElement
  menuFocus: string
  //Generic Dialog State
  dialogOpen: boolean,
  searchText: string,
  searchEnter: boolean,
  //State for Creation/Rename
  seedTag: string,
  originalName: string,
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
      seedTag: "",
      originalName: "",
    }
  }
  //Dialog Helpers
  finalTag = (searchText:string) => this.state.seedTag + searchText;
  clashes = (searchText:string) => this.props.tagCloud.includes(this.finalTag(searchText));
  validTagOrEmpty = (searchText:string) => 
    /^[\w \.\-~?!@#$%^&*()\/\\{}"'<>,.`]*$/.test(searchText) &&
                                   !/^\s+$/.test(searchText);
  invalid = (searchText:string) => searchText.length == 0 || this.clashes(searchText);
  //Dialog Closer
  handleCloseDialog = () => 
    this.setState({
      dialogOpen: false, 
      searchText: "", 
      seedTag: "",
      originalName: "",
  });
  
  //Dialog submission
  onSubmitAttempt(){
    const state = this.state;
    const props = this.props;
    if( this.invalid(state.searchText) ){
      return;
    }
    if( state.originalName.length > 0 ) {//Rename
      props.onUpdate(state.seedTag + state.originalName, state.searchText);
    }else{//Create
      props.onCreate(state.seedTag, state.searchText);
    }
    this.handleCloseDialog();
  }
  componentDidUpdate(){
    if(this.state.searchEnter){
      this.setState({searchEnter : false});
      this.onSubmitAttempt();
    }
  }
  render () {
    const props = this.props;
    const state = this.state;
    //Helper functions
    const parentDomain = (tag:string) => tag.substring(0, tag.lastIndexOf(":") + 1);
    const tagName = (tag:string) => tag.substring(tag.lastIndexOf(":") + 1, tag.length);
    const getDomainSiblings = (parentTagDomain:string) => 
      props.tagCloud.filter((candidate) => parentDomain(candidate) == parentTagDomain);
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
      props.onDestroy(state.menuFocus);
      handleCloseMenu();
    }
    const handleRename = () => 
      this.setState((prev) => {
        return {
          dialogOpen: true,
          anchor: null, 
          menuFocus: "", 
          seedTag: parentDomain(prev.menuFocus),
          originalName: tagName(prev.menuFocus),
          searchText:   tagName(prev.menuFocus),
        };
      });
    
    const handleCreate = (isBaseTag:boolean) => () => 
      this.setState((prev) => {
        return {
          dialogOpen: true,
          anchor: null, 
          menuFocus: "", 
          seedTag: isBaseTag ? "" : prev.menuFocus + ":",
          originalName: "",
          searchText: "New Tag",
        };
      });
    const handleSearch = (e: { target: { value: string; }; }) => {
      let newInputRaw:string = e.target.value;
      this.setState((prev) =>{
        let newInput = this.validTagOrEmpty(newInputRaw)
          ? newInputRaw
          : prev.searchText;
        let altEnter = newInputRaw.includes('\n');
        return {searchText: newInput, searchEnter: altEnter};
      });
    }
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
          onClose={this.handleCloseDialog} 
          aria-labelledby="form-dialog-title" 
          fullWidth maxWidth='md'>
          <DialogTitle id="form-dialog-title">{
            (state.originalName.length > 0 ? "Rename " : "Create New ") +
            (state.seedTag.length > 0 ? "Sub-" : "Base ")
            + "Tag"
          }</DialogTitle>
          <DialogContent>
            {getDomainSiblings(state.seedTag).map((data) => {
              const collision = this.finalTag(state.searchText) == data;
              return (
                <Chip
                  size= { collision ? 'medium' : "small"}
                  label={data}
                  icon={ collision ? <ErrorIcon style={{color: StringToColour(data, true)}}/>: undefined}
                  style={colourfulChipStyle(data)}
                  variant={ collision ? 'default' : 'outlined'}
                />);
              }
            )}
          <TextField
            margin="dense"
            id="search-tag-field"
            label={state.seedTag.length > 0 ? "Tag Domain: " + state.seedTag : "Base Tag:"}
            fullWidth
            autoFocus
            multiline
            rowsMax='1'
            value={state.searchText}
            onChange={handleSearch}
            error={this.invalid(state.searchText)}
            helperText={
              state.originalName.length > 0 && state.originalName == state.searchText
                ? "Need To Rename Tag"
                : state.searchText.length == 0 ? "Cannot be Blank" :"Collision with existing tag"}
          />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onSubmitAttempt} color="primary" disabled={this.invalid(state.searchText)}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}
export default TagCloud
