import React from "react";
import PropTypes from "prop-types";
import Item from "./Item";
import TagRender from "./TagRender";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import SortIcon from '@material-ui/icons/Sort';
class ListBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        entries: this.props.entries
    }
    this.updateTask = (identity, done, task, tags) => this.setState((prevState) => {
        let entries = prevState.entries;
        entries[identity] = {id: id, done: done, task: task, tags: tags}; //TODO: see if there is namespace fuckery
    });
    this.moveEntriesFuncGenerator = (src, dst) => () => this.setState(prevState => {
        let entries = prevState.entries;
        let temp = data[src];
        data[src] = data[dst];
        data[dst] = temp;
        return {entries: data};//TODO: Test this function later
    })
  }
  render () {
    const search = [];
    const paperStyle = {
        padding: "4px", 
        margin: "2px", 
        display:"flex", 
        alignItems:"safe center"
    }
    const resultsStyle = {//TODO: This should result in the top being visible whenever possible and the results scrolling
        padding: "4px", 
        margin: "2px", 
        maxHeight: '100%', 
        overflow: 'auto'
    }
    const genericDivStyle = {margin: "4px"}
    const searchTagsStyle = {
        margin: genericDivStyle.margin,
        //marginLeft: "auto" //NOTE: For now, stick to only search by tags, only uncomment if we are doing text search
    }
    const ItemHTMLBuilder = (value, index, array) => {
        return <Item {...value}/>
    }
    return (
      <React.Fragment>
        <Paper style={paperStyle}>
          <IconButton style={genericDivStyle}><SortIcon/></IconButton>
          <Divider style={genericDivStyle} orientation="vertical" flexItem />
          <IconButton style={genericDivStyle}><SearchIcon/></IconButton>
          <div style={searchTagsStyle}><TagRender tags={search}/></div>
        </Paper>
        <Paper style={resultsStyle}>{this.state.entries.map(ItemHTMLBuilder)}</Paper>
      </React.Fragment>
    );
  }
}

ListBody.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape(Item.itemOnlyPropTypes))
};
export default ListBody
