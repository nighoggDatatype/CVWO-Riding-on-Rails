import React from "react"
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import TagRender, {updateTags} from "./TagRender";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Divider from '@material-ui/core/Divider';
import EditTextDialog from './EditTextDialog';

export interface ItemDataProps {
  done: boolean,
  task: string,
  tags: string[],
}

export interface ItemRecordProps extends ItemDataProps{
    id: number,
  }

export interface updateItemDataFunc{
  (prev:ItemDataProps): ItemDataProps
}
interface ListFunctionProps  {
  onUpdate: (id: number, func: updateItemDataFunc) => void,
  onMoveUp?: () => void,
  onMoveDown?: () => void,
  onDelete: () => void,
}
interface TagCloudProps {
  tagCloud: string[], //TODO: Move this to tag render probably
  onToggleSearch: (tag: string) => void,
}
interface Props extends ItemRecordProps, ListFunctionProps, TagCloudProps{}

interface State {
  editDialogOpen: boolean,
}
class Item extends React.Component<Props,State> {
  handleSubmit: () => void;
  constructor(props) {
    super(props);
    this.state = {
        editDialogOpen: false, 
    }
  }
  
  render () {
    const props = this.props;
    const done = props.done;
    const handleOpen = () => this.setState({editDialogOpen: true});
    const handleClose = () => this.setState({editDialogOpen: false});
    const handleSubmit = (newText:string) => 
      props.onUpdate(props.id, prev => ({done: prev.done, task:newText, tags: prev.tags}));
    const toggleCheckbox = () => props.onUpdate(props.id, prev =>
      ({done: !prev.done, task: prev.task, tags: prev.tags})
    );
    const handleTags = (updater: updateTags) => 
      props.onUpdate(props.id, prev => ({done: prev.done, task:prev.task, tags: updater(prev.tags)}));
    
    //TODO: Intergrate this into proper css styling
    const paperStyle = {
        padding: "4px", 
        margin: "2px", 
        display:"flex", 
        alignItems:"safe center"
    }
    const genericDivStyle = {margin: "4px"}
    const startOfRightButtons = {
        margin: genericDivStyle.margin,
        marginLeft: "auto"
    }
    const texStyle = {margin: "8px"}//Set this as twice the genericDivStyle when I properly implement this. But this will do for now
    const textGroupStyle = {
        flex: 3, //Test this out, by making the text and tags very long
        display:"flex", 
        alignItems:"safe center"
    }
    const tagStyle = {
        flex: 1, 
        display:"flex", 
        flexWrap: "wrap" as "wrap" //Suppresses weird warnings from typescript 
    }
    //NOTE: Try to set trash icon to a danger colour
    return (
      <li key={props.id}>
        <Paper style={paperStyle}>
          <Checkbox checked={props.done} onClick={toggleCheckbox} style={genericDivStyle}/>
          <div style={textGroupStyle}>
            <div style={texStyle}>{done ? <s>{props.task}</s> : props.task}</div>
            {!done && <IconButton onClick={handleOpen} style={genericDivStyle}><EditIcon/></IconButton>}
            <EditTextDialog 
              open={this.state.editDialogOpen} defaultInput={props.task} textName='Task Description'
              onSubmit={handleSubmit} onClose={handleClose}/>
          </div>
          <Divider style={genericDivStyle} orientation="vertical" flexItem />
          <div style={tagStyle}>
            <TagRender tags={props.tags} onChangeTags={handleTags} 
            onToggleSearch={props.onToggleSearch} tagCloud={props.tagCloud}/></div>
          <Divider style={genericDivStyle} orientation="vertical" flexItem />
          <IconButton 
            style={startOfRightButtons} size='small'
            onClick={props.onMoveUp} disabled={!props.onMoveUp}><ArrowUpwardIcon/></IconButton>
          <IconButton 
            style={genericDivStyle} size='small' 
            onClick={props.onMoveDown} disabled={!props.onMoveDown}>
            <ArrowDownwardIcon/>
          </IconButton>
          <IconButton style={genericDivStyle} size='small' onClick={props.onDelete}><DeleteForeverIcon/></IconButton>
        </Paper>
      </li>
    );
  }
}

export default Item
