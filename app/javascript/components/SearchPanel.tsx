import React from "react"
import ListBody from "./ListBody"
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import {ItemData, ItemJson} from './ModelTypes';
import {updateItemDataFunc} from "./Item";
import {updateTags} from "./TagRender";

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
  itemDataMap: Map<number,ItemData>
  itemOrder: number[]
}

export interface updateItemStoreFunc{
  (prev:ItemStore): ItemStore
}

interface Props {
  itemStore: ItemStore
  onItemStoreUpdate: (prev:updateItemStoreFunc) => void
}

interface State {
  searchData: string[][]
  tagCloud: string[]
  tabState:number
}

class SearchPanel extends React.Component<Props,State> {
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
  createTask(data: ItemData){
    this.props.onItemStoreUpdate((prev) => {
      let newIndex:number = undefined
      do{
        newIndex = Math.floor(Math.random() * 1000 * 1000);
      }while(prev.itemDataMap.has(newIndex));
      prev.itemDataMap.set(newIndex, data);
      prev.itemOrder.push(newIndex);
      return prev;
    })
  }

  constructor(props) {
    super(props);
    const tagCloud = ["Monday", "Pets", "PraiseMami", "DabHarder", "Dab", 
      "MemesMemesMemes", "OhGodWhy", "AO3Tags", "Ipsum", "Lorem", "Tabs", "Latin"].sort();
    const searchList = [[],["Monday"],["Latin"]];
    this.state = {
      searchData: searchList,
      tagCloud: tagCloud,
      tabState: 2,
    }
    this.moveEntriesFuncGenerator = this.moveEntriesFuncGenerator.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.deleteFactory = this.deleteFactory.bind(this);
    this.createTask = this.createTask.bind(this);
  }
  render () {
    const handleChange = (_event, newValue) => {
      this.setState({tabState: newValue});
    };
    const handleSearch = (updater: updateTags) =>{
      this.setState(prev => {
        let tabID = prev.tabState;
        let searchList = prev.searchData;
        searchList[tabID] = updater(searchList[tabID]);
        return {searchData: searchList};
      })
    }
    const buildOrderedItems = ():ItemJson[] => {
      let data:ItemJson[] = [];
      this.props.itemStore.itemOrder.forEach(id => 
        data.push({id: id, ...this.props.itemStore.itemDataMap.get(id)}));
      return data;
    } 
    return (
      <React.Fragment>
        <Tabs value={this.state.tabState} onChange={handleChange}>
          {this.state.searchData.map((_value,index) => <Tab id={index.toString()} label={"Tab "+ (index+1).toString()}/>)}
        </Tabs>
        {this.state.searchData.map((value,index) => 
          <TabPanel value={this.state.tabState} index={index}>
            <ListBody 
              entries={buildOrderedItems()} 
              moveEntriesGenerator={this.moveEntriesFuncGenerator}
              onUpdateTask={this.updateTask}
              deleteFactory={this.deleteFactory}
              tagCloud={this.state.tagCloud}
              searchTags={value}
              onUpdateSearch={handleSearch}
              onCreate={this.createTask}/>
          </TabPanel>)}
      </React.Fragment>
    );
  }
}
export default SearchPanel
