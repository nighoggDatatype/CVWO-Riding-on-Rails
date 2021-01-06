import React from "react"
import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/Add';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { Search } from "@material-ui/icons";

export interface updateTags {
  (tag:string[]): string[]
}

export function togglerGenerator(toToggle: string){
  return (searchTags: string[]) => {
    let index = searchTags.indexOf(toToggle); 
    if (index > -1){searchTags.splice(index,1);}
    else {
      for (var i = 0; i < searchTags.length && toToggle.localeCompare(searchTags[i]) > 0; i++) {}
      searchTags.splice(i, 0, toToggle)
    }
    return searchTags;
  }
}

interface Props {
  tags: string[],
  tagCloud: string[],
  onToggleSearch?: (tag:string) => void,
  onChangeTags: (updater: updateTags) => void,
};

interface State {
  dialogOpen: boolean,
  searchText: string,
  searchEnter: boolean,
}

class TagRender extends React.Component<Props,State> {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      searchText: "",
      searchEnter: false,
    }
  }
  getAddCloud = () => this.props.tagCloud.filter(x=>this.props.tags.indexOf(x)<0);
  searchTags = (search:string) => 
    this.getAddCloud().filter(candidate => candidate.slice(0,search.length)==search);
  
  onSubmitFactory = (submission: string) => () => this.props.onChangeTags(currentTags =>{
    for (var i = 0; i < currentTags.length && submission.localeCompare(currentTags[i]) > 0; i++) {}
    currentTags.splice(i, 0, submission)
    return currentTags;
  });
  onSearchSubmitAttempt = () => {
    const results = this.searchTags(this.state.searchText);
    if (results.length == 1){
      this.onSubmitFactory(results[0])();
    }
  };

  componentDidUpdate(){
    if(this.state.searchEnter){
      this.setState({searchEnter : false});
      this.onSearchSubmitAttempt();
    }
  }
  render () {//NOTE: Don't reuse this for tag-cloud management, the interface requirements per tag are deletion, include, exclude, subtag creation, renaming, ect, and its too complex in general
    let props = this.props;
    const searchResults = this.searchTags(this.state.searchText);
    const emptySearchResult = searchResults.length == 0;
    const noUniqueResult = searchResults.length != 1;

    const handleClose = () => this.setState({dialogOpen: false, searchText: ""});
    const handleDeleteFactory = (toDelete: string) =>
      () => {props.onChangeTags(currentTags => {
        const index = currentTags.indexOf(toDelete); 
        if (index > -1){currentTags.splice(index,1);}
        return currentTags;
      })};
    const handleSearch = (e) => {
      let newInputRaw = e.target.value;
      let newInput = newInputRaw.replace("\n","");
      let haveUniqueResult = this.searchTags(newInput).length == 1;
      let altEnter = haveUniqueResult && newInputRaw.includes('\n');
      //TODO: When I decided on my tag format, filter for input that is obviously invalid.
      this.setState({searchText: newInput, searchEnter: altEnter});
    }
    return (
      <React.Fragment>
        {this.props.tags.map((data) => 
            <Chip
              size="small"
              label={data}
              onClick={() => this.props.onToggleSearch(data)}
              onDelete={handleDeleteFactory(data)}
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
            {this.searchTags(this.state.searchText).map((data) => 
              <Chip
                size="small"
                label={data}
                onClick={this.onSubmitFactory(data)}
                style={{margin:"4px"}}
              />
            )}
          <TextField
            margin="dense"
            id="search-tag-field"
            label="Search"
            fullWidth
            value={this.state.searchText}
            onChange={handleSearch}
            error={emptySearchResult}
            helperText="Search result is empty"
          />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onSearchSubmitAttempt} color="primary" disabled={noUniqueResult}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}
export default TagRender