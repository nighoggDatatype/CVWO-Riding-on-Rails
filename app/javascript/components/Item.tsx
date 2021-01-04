import React from "react"
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Paper from '@material-ui/core/Paper';
import TagRender from "./TagRender";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Divider from '@material-ui/core/Divider';
import EditTextDialog from './EditTextDialog'

export interface itemRecordProps {
  id: number,
  done: boolean,
  task: string,
  tags: string[],
}

interface Props extends itemRecordProps {//TODO: Change the functions as needed, also rename them to follow convension
  onUpdate: () => void,
  onMoveUp?: () => void,
  onMoveDown?: () => void,
  onDelete: () => void,
}

interface State {
  done: boolean,
  task: string,
  editDialogOpen: boolean,
}

class Item extends React.Component<Props,State> {
  handleSubmit: () => void;
  constructor(props) {
    super(props);
    this.state = {
        done: this.props.done,
        task: this.props.task, 
        editDialogOpen: false, 
    }
  }
  
  render () {
    const done = this.state.done;
    const handleOpen = () => this.setState({editDialogOpen: true});
    const handleClose = () => this.setState({editDialogOpen: false});
    const handleSubmit = (newText:string) => this.setState({task: newText, editDialogOpen: false});
    const toggleCheckbox = () => this.setState((prev) => ({done: !prev.done}))
    
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
      <li key={this.props.id}>
        <Paper style={paperStyle}>
          <Checkbox checked={this.state.done} onClick={toggleCheckbox} style={genericDivStyle}/>
          <div style={textGroupStyle}>
            <div style={texStyle}>{done ? <s>{this.state.task}</s> : this.state.task}</div>
            {!done && <IconButton onClick={handleOpen} style={genericDivStyle}><EditIcon/></IconButton>}
            <EditTextDialog 
              open={this.state.editDialogOpen} defaultInput={this.state.task} textName='Task Description'
              onSubmit={handleSubmit} onClose={handleClose}/>
          </div>
          <Divider style={genericDivStyle} orientation="vertical" flexItem />
          <div style={tagStyle}><TagRender tags={this.props.tags}/></div>
          <Divider style={genericDivStyle} orientation="vertical" flexItem />
          <IconButton 
            style={startOfRightButtons} size='small'
            onClick={this.props.onMoveUp} disabled={!this.props.onMoveUp}><ArrowUpwardIcon/></IconButton>
          <IconButton 
            style={genericDivStyle} size='small' 
            onClick={this.props.onMoveDown} disabled={!this.props.onMoveDown}>
            <ArrowDownwardIcon/>
          </IconButton>
          <IconButton style={genericDivStyle} size='small' onClick={this.props.onDelete}><DeleteForeverIcon/></IconButton>
        </Paper>
      </li>
    );
  }
}

export default Item
