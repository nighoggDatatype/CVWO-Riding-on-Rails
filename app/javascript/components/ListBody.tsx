import React from "react";
import Item, {itemRecordProps} from "./Item";
import TagRender from "./TagRender";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import SortIcon from '@material-ui/icons/Sort';


interface Props {
  entries: itemRecordProps[]
};

class ListBody extends React.Component<Props,Props> {
  moveEntriesFuncGenerator: (src: any, dst: any) => () => void;
  updateTask: (data: itemRecordProps) => void;
  constructor(props) {
    super(props);
    this.state = {
        entries: this.props.entries
    }
    this.updateTask = (data: itemRecordProps) => this.setState((prevState) => {
        let entries = prevState.entries;
        let identity = data.id;
        entries[identity] = data;//TODO: Fix this part cause this doesn't work for sure 
        return {entries: entries};
    });
    this.moveEntriesFuncGenerator = (src, dst) => () => this.setState(prevState => {
        let data = prevState.entries;
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
      let data: itemRecordProps = {} as itemRecordProps //NOTE this needs to be the props for Item, fix later
      data = Object.assign(data, value);
      if (index != 0){
        let prev = array[index-1];
        value.moveUpFunc = this.moveEntriesFuncGenerator(data.id, prev.id);
      }
      if (index < array.length - 1){
        let next = array[index+1];
        value.moveDownFunc = this.moveEntriesFuncGenerator(data.id, next.id);
      }
      return <Item {...data}/>
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
export default ListBody
