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
        //marginLeft: "auto" //NOTE: For now, stick to only search by tags
    }
    return (
      <React.Fragment>
        <Paper style={paperStyle}>
          <IconButton style={genericDivStyle}><SortIcon/></IconButton>
          <Divider style={genericDivStyle} orientation="vertical" flexItem />
          <IconButton style={genericDivStyle}><SearchIcon/></IconButton>
          <div style={searchTagsStyle}><TagRender tags={search}/></div>
        </Paper>
        <Paper style={resultsStyle}>{this.props.entries.map((data) => <Item {...data}/>)}</Paper>
      </React.Fragment>
    );
  }
}

ListBody.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape(Item.propTypes))
};
export default ListBody
