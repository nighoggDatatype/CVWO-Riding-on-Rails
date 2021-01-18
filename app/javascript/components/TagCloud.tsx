import React from "react"
import Paper from "@material-ui/core/Paper";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Chip from '@material-ui/core/Chip';
import StringToColour from "./StringToColour";

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
        {this.props.tagCloud.map((data) => {
          return (
              <Chip
                label={data}
                onDelete={handleClickFactory(data)}
                style={{
                  margin: "4px",
                  backgroundColor: StringToColour(data, false),
                  color: StringToColour(data, true)
                }}
                deleteIcon ={<MoreVertIcon/>}
              />
          );
          })}
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchor}
          keepMounted
          open={Boolean(this.state.anchor)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Rename</MenuItem>
          <MenuItem onClick={handleClose}>Create Sub-tag</MenuItem>
          <MenuItem onClick={handleClose}>Delete</MenuItem>
        </Menu>
      </Paper>
    );
  }
}
export default TagCloud
