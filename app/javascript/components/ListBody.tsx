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
        entries[identity] = data;//TODO: Fix this part cause this doesn't work for sure.
        return {entries: entries};
    });
    this.moveEntriesFuncGenerator = (src, dst) => () => this.setState(prevState => {
        let data = prevState.entries;
        let temp = data[src];
        data[src] = data[dst];
        data[dst] = temp;
        return {entries: data};//Note: This definitely breaks. TODO: Seperate id->data and [id,id,id] information
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
      //From: https://stackoverflow.com/a/50769802
      type Mutable<T> = {//TODO: Move this into its own helper file
        -readonly [P in keyof T]: T[P];
      };//See: https://www.reddit.com/r/reactjs/comments/4dya4z/where_to_put_helper_functions_in_a_react_component/
      type ItemProps = Mutable<Item['props']>

      //Right now this still should be spitting out errors
      //I think its because it thinks I passed it update and delete Func because of "{} as ItemProps"
      //Need to change it later probably if I want to be perfect.
      let data: ItemProps = {} as ItemProps 
      data = Object.assign(data, value);
      if (index != 0){
        let prev = array[index-1];
        data.onMoveUp = this.moveEntriesFuncGenerator(data.id, prev.id);
      }
      if (index < array.length - 1){
        let next = array[index+1];
        data.onMoveDown = this.moveEntriesFuncGenerator(data.id, next.id);
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
