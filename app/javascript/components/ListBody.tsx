import React from "react";
import Item, {itemRecordProps, updateFunc} from "./Item";
import TagRender, {updateTags, togglerGenerator} from "./TagRender";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import SortIcon from '@material-ui/icons/Sort';


interface Props {
  moveEntriesGenerator: (srcId: number, dstId: number) => () => void,
  onUpdateTask: (id: number, func: updateFunc) => void,
  deleteFactory: (id: number) => () => void,
  entries: itemRecordProps[],
  tagCloud: string[],
  searchTags: string[]
  onUpdateSearch:  (updater: updateTags) => void,
};

class ListBody extends React.Component<Props> {
  render () {
    var props = this.props;
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
    
    const togglerHandler = (toToggle: string) => props.onUpdateSearch(togglerGenerator(toToggle));
    const filteredList = props.entries.filter((entry) => {
      for(let i = 0; i < props.searchTags.length; i++){
        if (!entry.tags.includes(props.searchTags[i])){
          return false;
        }
      }
      return true;
    })
    const ItemHTMLBuilder = (value: itemRecordProps, index: number, array: string | any[]) => {
      //From: https://stackoverflow.com/a/50769802
      type Mutable<T> = {//TODO: Move this into its own helper file
        -readonly [P in keyof T]: T[P];
      };//See: https://www.reddit.com/r/reactjs/comments/4dya4z/where_to_put_helper_functions_in_a_react_component/
      type ItemProps = Mutable<Item['props']>
      let data:ItemProps = {
        onUpdate: props.onUpdateTask,
        onDelete: props.deleteFactory(value.id),
        tagCloud: props.tagCloud,
        onToggleSearch: togglerHandler,
        ...value
      };
      if (index != 0){
        let prev = array[index-1];
        data.onMoveUp = props.moveEntriesGenerator(data.id, prev.id);
      }
      if (index < array.length - 1){
        let next = array[index+1];
        data.onMoveDown = props.moveEntriesGenerator(data.id, next.id);
      }
      return <Item {...data}/>
    }
    return (
      <React.Fragment>
        <Paper style={paperStyle}>
          <IconButton style={genericDivStyle}><SortIcon/></IconButton>
          <Divider style={genericDivStyle} orientation="vertical" flexItem />
          <IconButton style={genericDivStyle}><SearchIcon/></IconButton>
          <div style={searchTagsStyle}>
            <TagRender tags={props.searchTags} tagCloud={props.tagCloud} onChangeTags={props.onUpdateSearch}/></div>
        </Paper>
        <Paper style={resultsStyle}>{filteredList.map(ItemHTMLBuilder)}</Paper>
      </React.Fragment>
    );
  }
}
export default ListBody
