import React from "react";
import {ItemData, ItemJson} from './ModelTypes';
import Item, {updateFunc} from "./Item";
import TagRender, {updateTags, togglerGenerator} from "./TagRender";
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import SortIcon from '@material-ui/icons/Sort';
import AddIcon from '@material-ui/icons/Add';
import EditTextDialog from './EditTextDialog'


interface Props {
  moveEntriesGenerator: (srcId: number, dstId: number) => () => void,
  onUpdateTask: (id: number, func: updateFunc) => void,
  deleteFactory: (id: number) => () => void,
  entries: ItemJson[],
  tagCloud: string[],
  searchTags: string[]
  onUpdateSearch:  (updater: updateTags) => void,
  onCreate: (newItem: ItemData) => void,
};

interface State {
  editDialogOpen:boolean
}

class ListBody extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
        editDialogOpen: false, 
    }
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
        if (!entry.tags.includes(props.searchTags[i])){
          return false;
        }
      }
      return true;
    })
    const ItemHTMLBuilder = (value: ItemJson, index: number, array: string | any[]) => {
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
    const handleClose = () => this.setState({editDialogOpen: false});
    const handleOpen = () => this.setState({editDialogOpen: true});
    const handleSubmit = (newTask:string) => 
      props.onCreate({done: false, task: newTask, tags: props.searchTags}) 
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
            onSubmit={handleSubmit} onClose={handleClose}
          />
          </div>
        </Paper>
      </React.Fragment>
    );
  }
}
export default ListBody
