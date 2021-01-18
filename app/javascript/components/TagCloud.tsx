import React from "react"
import Paper from "@material-ui/core/Paper";
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import StringToColour from "./StringToColour";
import { makeStyles } from '@material-ui/core/styles';

interface Props {
  tagCloud: string[],//TODO: If need be, see about making this the raw tags.
  tagSelection: string[],
  //onUpdate: (newTags: {parent:string,tag:string}[], changedTags:{before:string, after:string}[], deletedTags:string[]) => void,
}

interface State {
  anchor: HTMLElement
  menuFocus: string
}

class TagCloud extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      anchor: null, 
      menuFocus: ""
    }
  }
  render () {
    const handleClickFactory = (data: string) => (event) => {
      this.setState({anchor: event.currentTarget, menuFocus: data});
    };

    const handleClose = () => {
      this.setState({anchor: null, menuFocus: ""});
    };
    return (
      <Paper>
        {this.props.tagCloud.map((data) => 
            <ButtonGroup
              size="small" 
              variant={this.props.tagSelection.includes(data) ? "contained" : "text"}
            >
              <Button>{data}</Button>
              <IconButton onClick={handleClickFactory(data)}><MoreVertIcon/></IconButton>
            </ButtonGroup>
          )}
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchor}
          keepMounted
          open={Boolean(this.state.anchor)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Rename</MenuItem>
          <MenuItem onClick={handleClose}>Create Sub-tag</MenuItem>
          <MenuItem onClick={handleClose}>Exclude from Search</MenuItem>
        </Menu>
      </Paper>
    );
  }
}
export default TagCloud
