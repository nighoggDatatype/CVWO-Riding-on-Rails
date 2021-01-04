import React from "react";
import Item, {itemRecordProps, updateFunc,itemDataProps} from "./Item";
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
  lookupById(id: number){
    return this.state.entries.findIndex((value) => value.id == id);
  }
  moveEntriesFuncGenerator(srcId: number, dstId: number){
    return () => this.setState(prevState => {
      let data = prevState.entries;
      let src = this.lookupById(srcId);
      let dst = this.lookupById(dstId);
      let temp = data[src];
      data[src] = data[dst];
      data[dst] = temp;
      return {entries: data};
    });
  }
  updateTask(id: number, func: updateFunc){
    this.setState(prev => {
      let entries = prev.entries;
      let identity = this.lookupById(id);
      entries[identity] = {id: id, ...func(entries[identity])};
      return {entries: entries};
    });
  }
  deleteFactory(id: number){
    return () => {
      let index = this.lookupById(id);
      if (index > -1){
        this.setState(prev =>{
          prev.entries.splice(index,1);
          return {entries:prev.entries};
        })
      }
    };
  }
  constructor(props) {
    super(props);
    this.state = {
        entries: this.props.entries
    }
    this.updateTask = this.updateTask.bind(this);
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
    const ItemHTMLBuilder = (value: itemRecordProps, index: number, array: string | any[]) => {
      //From: https://stackoverflow.com/a/50769802
      type Mutable<T> = {//TODO: Move this into its own helper file
        -readonly [P in keyof T]: T[P];
      };//See: https://www.reddit.com/r/reactjs/comments/4dya4z/where_to_put_helper_functions_in_a_react_component/
      type ItemProps = Mutable<Item['props']>

      let data:ItemProps = {
        onUpdate: this.updateTask,
        onDelete: this.deleteFactory(value.id),
        ...value
      };
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
