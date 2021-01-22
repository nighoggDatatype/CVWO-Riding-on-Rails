import React from "react";
import {ItemDataProps, ItemRecordProps} from './Item';
import Item, {updateItemDataFunc} from "./Item";
import TagRender, {updateTags, togglerGenerator} from "./TagRender";
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import SortIcon from '@material-ui/icons/Sort';
import AddIcon from '@material-ui/icons/Add';
import EditTextDialog from './EditTextDialog'
import { ItemStore, updateItemStoreFunc } from "./SearchPanel";
import { generateTempId } from "./ModelTypes";


interface Props {
  onItemStoreUpdate: (prev:updateItemStoreFunc) => void,
  entries: ItemRecordProps[],
  tagCloud: string[],
  searchTags: string[]
  onUpdateSearch:  (updater: updateTags) => void,
};

interface State {
  editDialogOpen:boolean
}

class ListBody extends React.Component<Props, State> {
  moveEntriesFuncGenerator(srcId: number, dstId: number){
    return () => this.props.onItemStoreUpdate((prev:ItemStore) => {
      //Get Variables
      let order = prev.itemOrder;
      //Perform Swap
      let srcIndex = order.indexOf(srcId)
      let dstIndex = order.indexOf(dstId);
      order[srcIndex] = dstId;
      order[dstIndex] = srcId;

      return {itemDataMap: prev.itemDataMap, itemOrder: order};
    });
  }
  updateTask(id: number, func: updateItemDataFunc){
    this.props.onItemStoreUpdate(prev => {
        let entries = prev.itemDataMap;
        entries.set(id, func(entries.get(id)));
        return {itemDataMap: entries, itemOrder: prev.itemOrder};
      });
  }
  deleteFactory(id: number){
    return () => {
      this.props.onItemStoreUpdate(prev =>{
        prev.itemDataMap.delete(id);
        prev.itemOrder = prev.itemOrder.filter(item => item !== id)
        return prev;
      });
    };
  }
  createTask(data: ItemDataProps){
    this.props.onItemStoreUpdate((prev) => {
      let newIndex:number = generateTempId(prev.itemDataMap);
      prev.itemDataMap.set(newIndex, data);
      prev.itemOrder.push(newIndex);
      return prev;
    })
  }

  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
        editDialogOpen: false, 
    }
    this.moveEntriesFuncGenerator = this.moveEntriesFuncGenerator.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.deleteFactory = this.deleteFactory.bind(this);
    this.createTask = this.createTask.bind(this);
  }
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
        let searchTerm = props.searchTags[i];
        if (!entry.tags.some(entryTag => entryTag.indexOf(searchTerm) == 0)){
          return false;
        }
      }
      return true;
    })
    const ItemHTMLBuilder = (value: ItemRecordProps, index: number, array: string | any[]) => {
      //From: https://stackoverflow.com/a/50769802
      type Mutable<T> = {//TODO: Move this into its own helper file
        -readonly [P in keyof T]: T[P];
      };//See: https://www.reddit.com/r/reactjs/comments/4dya4z/where_to_put_helper_functions_in_a_react_component/
      type ItemProps = Mutable<Item['props']>
      let data:ItemProps = {
        onUpdate: this.updateTask,
        onDelete: this.deleteFactory(value.id),
        tagCloud: props.tagCloud,
        onToggleSearch: togglerHandler,
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
    const handleClose = () => this.setState({editDialogOpen: false});
    const handleOpen = () => this.setState({editDialogOpen: true});
    const handleSubmit = (newTask:string) => 
      this.createTask({done: false, task: newTask, tags: props.searchTags}) 
    return (
      <React.Fragment>
        <Paper style={paperStyle}>
          <IconButton style={genericDivStyle}><SortIcon/></IconButton>
          <Divider style={genericDivStyle} orientation="vertical" flexItem />
          <IconButton style={genericDivStyle}><SearchIcon/></IconButton>
          <div style={searchTagsStyle}>
            <TagRender tags={props.searchTags} tagCloud={props.tagCloud} onChangeTags={props.onUpdateSearch}/></div>
        </Paper>
        <Paper style={resultsStyle}>
          {filteredList.map(ItemHTMLBuilder)}
          <div style={{margin: "4px", display:"flex", alignItems:"safe center"}}>
            <Button variant="contained" color="primary" 
              size="large" startIcon={<AddIcon />} onClick={handleOpen} fullWidth>
              Add New Item
            </Button>
          <EditTextDialog 
            open={this.state.editDialogOpen} defaultInput="" textName='New Task'
            onSubmit={handleSubmit} onClose={handleClose} actionString="Add"
          />
          </div>
        </Paper>
      </React.Fragment>
    );
  }
}
export default ListBody
