import React from "react"
import ListBody from "./ListBody"
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import {ItemData, ItemJson} from './ModelTypes';
import {updateFunc} from "./Item";
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

interface Props {
}

interface State {
  itemDataMap: Map<number,ItemData>
  itemOrder: number[]
  searchData: string[][]
  tagCloud: string[]
  tabState:number
}

class SearchPanel extends React.Component<Props,State> {
  moveEntriesFuncGenerator(srcId: number, dstId: number){
    return () => this.setState(prevState => {
      let order = prevState.itemOrder;
      let srcIndex = order.indexOf(srcId)
      let dstIndex = order.indexOf(dstId);
      order[srcIndex] = dstId;
      order[dstIndex] = srcId;
      return {itemOrder: order};
    });
  }
  updateTask(id: number, func: updateFunc){
      this.setState(prev => {
        let entries = prev.itemDataMap;
        entries.set(id, func(entries.get(id)));
        return {itemDataMap: entries};
      });
  }
  deleteFactory(id: number){
    return () => {
      this.setState(prev =>{
        prev.itemDataMap.delete(id);
        return {
          itemDataMap: prev.itemDataMap, 
          itemOrder: prev.itemOrder.filter(item => item !== id)
        };
      });
    };
  }
  createTask(data: ItemData){
    this.setState((prev) => {
      let newIndex:number = undefined
      do{
        newIndex = Math.floor(Math.random() * 1000 * 1000);
      }while(prev.itemDataMap.has(newIndex));
      prev.itemDataMap.set(newIndex, data);
      prev.itemOrder.push(newIndex);
      return {itemDataMap: prev.itemDataMap, itemOrder: prev.itemOrder};
    })
  }

  constructor(props) {
    super(props);
    const longFillerText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, "
      + "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
      + "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
      + "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
      + "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    const longTagList = ["Monday", "Pets", "PraiseMami", "DabHarder", "Dab", "MemesMemesMemes", "OhGodWhy", "AO3Tags", "Ipsum", "Lorem", "Tabs"].sort();
    const testData = new Map<number,ItemData>();
    testData.set(1111,{done:false, task:"Go Jog", tags:["Monday", "Latin"]})
    testData.set(888, {done:true, task:longFillerText, tags:["Latin"] })
    testData.set(1234,{done:true, task:"Walk the Dog", tags:longTagList})
    const testOrder = [1111,888,1234];
    const tagCloud = ["Monday", "Pets", "PraiseMami", "DabHarder", "Dab", 
      "MemesMemesMemes", "OhGodWhy", "AO3Tags", "Ipsum", "Lorem", "Tabs", "Latin"].sort();
    const searchList = [[],["Monday"],["Latin"]];
    this.state = {
      itemDataMap: testData,
      itemOrder: testOrder,
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
      this.state.itemOrder.forEach(id => 
        data.push({id: id, ...this.state.itemDataMap.get(id)}));
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
