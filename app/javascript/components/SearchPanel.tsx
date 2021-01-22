import React from "react"
import ListBody from "./ListBody"
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper"
import {ItemDataProps, ItemRecordProps} from './Item';
import {updateTags} from "./TagRender";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { generateTempId } from "./ModelTypes";
import EditTextDialog from "./EditTextDialog";

function TabPanel(props: { [x: string]: any; children: any; value: number; index: number; }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value != index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value == index && (
        <Box>{children}</Box>
      )}
    </div>
  );
}

export interface ItemStore {
  itemDataMap: Map<number,ItemDataProps>
  itemOrder: number[]
}

export interface updateItemStoreFunc{
  (prev:ItemStore): ItemStore
}

export interface SearchTabDataProp {
  name: string,
  tags: string[],
}

export interface SearchTabStore {
  tabDataMap: Map<number,SearchTabDataProp>,
  tabOrder: number[],
  tabState: number,
}

export interface updateTabStoreFunc{
  (prev:SearchTabStore): SearchTabStore
}

interface Props {
  itemStore: ItemStore,
  onItemStoreUpdate: (prev:updateItemStoreFunc) => void,
  searchData: SearchTabStore,
  onTabStoreUpdate: (prev:updateTabStoreFunc) => void,
  tagCloud: string[],
}

interface State {
  editDialogOpen: boolean
  defaultInput: string
  actionString: string
}

class SearchPanel extends React.Component<Props,State> {
  createTab(name:string){
    this.props.onTabStoreUpdate(searchData =>{
      searchData.tabState = searchData.tabOrder.length; //Give focus to new tab
      let tempId = generateTempId(searchData.tabDataMap);
      searchData.tabDataMap.set(tempId, {name: name, tags: []});
      searchData.tabOrder.push(tempId);
      return searchData;
    });
  }
  moveTab(isRight:boolean){
    this.props.onTabStoreUpdate(searchData =>{
      let src = searchData.tabState;
      let dest = searchData.tabState + (isRight ? 1 : -1);
      let order = searchData.tabOrder;
      if (0 <= dest && dest < order.length){
        let temp = order[src];
        order[src] = order[dest];
        order[dest] = temp;
        searchData.tabState = dest; //Adjust focus to moved tab
      }
      searchData.tabOrder = order;
      return searchData;
    })
  }
  renameTag(newName:string){
    this.props.onTabStoreUpdate(searchData =>{
      let id = searchData.tabOrder[searchData.tabState];
      let data = searchData.tabDataMap.get(id);
      data.name = newName;
      searchData.tabDataMap.set(id, data);
      return searchData;
    });
  }
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
      editDialogOpen: false,
      defaultInput: "",
      actionString: "",
    }
  }
  render () {
    const deleteTag = () => { 
      //Note: For some reason, defining this in render instead of as a method of SearchPanel prevents error
      //      And I wish I knew why. :/ 
      //      This is basically an example of it works now and I don't know why.
    this.props.onTabStoreUpdate(searchData =>{
        let pos = searchData.tabState;
        let id = searchData.tabOrder[pos];
        if (pos >= searchData.tabOrder.length - 1){
          searchData.tabState = pos - 1; //Remove focus from deleted tag
        }
        searchData.tabDataMap.delete(id);
        searchData.tabOrder = searchData.tabOrder.filter(order_id => order_id !== id);
        return searchData;
      });
    }
    const handleChange = (_event: any, newValue: any) => {
      this.props.onTabStoreUpdate(searchData =>{
        searchData.tabState = newValue;
        return searchData;
      });
    };
    const handleSearch = (updater: updateTags) =>{
      this.props.onTabStoreUpdate(searchData =>{
        let tabPos = searchData.tabState;
        let tabId = searchData.tabOrder[tabPos];
        let tabData = searchData.tabDataMap.get(tabId);
        tabData.tags = updater(tabData.tags);
        searchData.tabDataMap.set(tabId,tabData);
        return searchData;
      })
    }
    const buildOrderedItems = ():ItemRecordProps[] => {
      let data:ItemRecordProps[] = [];
      this.props.itemStore.itemOrder.forEach(id => 
        data.push({id: id, ...this.props.itemStore.itemDataMap.get(id)}));
      return data;
    } 
    const searchData = this.props.searchData;
    const tabState = searchData.tabState;
    const genericStyle = {margin: "4px"}
    const sectionStyle = {
      flex: 1, 
      display:"flex", 
      alignItems:"safe center",
    }
    const pushRightStyle = {
      margin: genericStyle.margin,
      marginLeft: "auto"
    }
    const paperStyle = {
      padding: "4px", 
      margin: "2px", 
      display:"flex", 
      alignItems:"safe center"
    }
    const length = searchData.tabOrder.length; //TODO: When this is zero, show something special
    const handleClose = () => this.setState({editDialogOpen: false, defaultInput:"", actionString:""});
    const handleOpenEdit = () => this.setState(() => {
      let pos = searchData.tabState
      let id = searchData.tabOrder[pos];
      let currentName = searchData.tabDataMap.get(id).name;
      return {editDialogOpen: true, defaultInput: currentName, actionString: "Edit"}
    });
    const handleOpenAdd = () => this.setState({editDialogOpen: true, defaultInput: "", actionString: "Add"})
    const handleSubmit = (newTask:string) => {
      switch(this.state.actionString){
        case "Edit":
          this.renameTag(newTask);
          break;
        case "Add":
          this.createTab(newTask);
          break;
      }
      handleClose()
    }
    const isValid = (candidate:string) =>{
      return /^\w+$/.test(candidate);
    }
    return (
      <React.Fragment>
        <Paper style={paperStyle}>
          <Button color="primary" variant="contained" style={genericStyle}
            onClick={handleOpenAdd}><AddIcon/>Add New Tab</Button>
          <Button color="primary" variant="outlined" style={genericStyle} 
            onClick={handleOpenEdit}><EditIcon/>Rename Current Tab</Button>
          <Divider style={genericStyle} orientation="vertical" flexItem />
          <div style={sectionStyle}>
            <IconButton style={genericStyle} 
              onClick={() => this.moveTab(false)} disabled={tabState < 1}>
              <ArrowBackIosIcon/>
            </IconButton>
            {"Move Tab " + (tabState+1) + ": \"" + searchData.tabDataMap.get(searchData.tabOrder[tabState]).name + "\""}
            <IconButton style={genericStyle} 
              onClick={() => this.moveTab(true)} disabled={tabState < 0 || tabState > length - 2}>
              <ArrowForwardIosIcon/>
            </IconButton>
          </div>
          <Divider style={genericStyle} orientation="vertical" flexItem />
          <div style={pushRightStyle}>
            <Button color="secondary" variant="contained" 
              onClick={deleteTag} disabled={length < 2}><DeleteForeverIcon/>Delete Current Tab</Button>
          </div>
          <EditTextDialog 
            open={this.state.editDialogOpen} defaultInput={this.state.defaultInput} textName='Search Tab'
            onSubmit={handleSubmit} onClose={handleClose} actionString={this.state.actionString}
            isMultiline={false} isValid={isValid}/>
        </Paper>
        <Tabs value={tabState} onChange={handleChange} variant="scrollable" scrollButtons="on">
          {searchData.tabOrder.map((value,index) => 
            <Tab id={index.toString()} label={searchData.tabDataMap.get(value).name}/>)}
        </Tabs>
        {searchData.tabOrder.map((value,index) => 
          <TabPanel value={tabState} index={index}>
            <ListBody 
              entries={buildOrderedItems()} 
              tagCloud={this.props.tagCloud}
              searchTags={searchData.tabDataMap.get(value).tags}
              onUpdateSearch={handleSearch}
              onItemStoreUpdate={this.props.onItemStoreUpdate}/>
          </TabPanel>)}
      </React.Fragment>
    );
  }
}
export default SearchPanel
