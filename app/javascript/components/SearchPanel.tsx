import React from "react"
import ListBody from "./ListBody"
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import {itemRecordProps, updateFunc, itemDataProps} from "./Item";
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
  garbage:string,
}

interface State {
  itemData: itemRecordProps[]
  searchData: string[][]
  tabCloud: string[]
  tabState:number
}

class SearchPanel extends React.Component<Props,State> {
  lookup(id: number){
    return this.state.itemData.findIndex((value) => value.id == id);
  }
  moveEntriesFuncGenerator(srcId: number, dstId: number){
    return () => this.setState(prevState => {
      let data = prevState.itemData;
      let src = this.lookup(srcId);
      let dst = this.lookup(dstId);
      let temp = data[src];
      data[src] = data[dst];
      data[dst] = temp;
      return {itemData: data};
    });
  }
  updateTask(id: number, func: updateFunc){
      this.setState(prev => {
        let entries = prev.itemData;
        let identity = this.lookup(id);
        entries[identity] = {id: id, ...func(entries[identity])};
        return {itemData: entries};
      });
  }
  deleteFactory(id: number){
    return () => {
      let index = this.lookup(id);
      if (index > -1){
        this.setState(prev =>{
          prev.itemData.splice(index,1);
          return {itemData:prev.itemData};
        })
      }
    };
  }
  createTask(data: itemDataProps){
    this.setState((prev) => {
      let newIndex:number = undefined
      do{
        newIndex = Math.floor(Math.random() * 1000 * 1000);
      }while(this.lookup(newIndex) != -1);
      let newItem:itemRecordProps = {id:newIndex, ...data};
      prev.itemData.push(newItem);
      return {itemData: prev.itemData};
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
    const testData = 
      [{ id: 1111, done:false, task:"Go Jog", tags:["Monday", "Latin"] }
      ,{ id: 888, done:true, task:longFillerText, tags:["Latin"] }
      ,{ id: 1234, done:true, task:"Walk the Dog", tags:longTagList}
    ]
    const tagCloud = ["Monday", "Pets", "PraiseMami", "DabHarder", "Dab", 
      "MemesMemesMemes", "OhGodWhy", "AO3Tags", "Ipsum", "Lorem", "Tabs", "Latin"].sort();
    const searchList = [[],["Monday"],["Latin"]];
    this.state = {
      itemData: testData,
      searchData: searchList,
      tabCloud: tagCloud,
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
    return (
      <React.Fragment>
        <Tabs value={this.state.tabState} onChange={handleChange}>
          {this.state.searchData.map((_value,index) => <Tab id={index.toString()} label={"Tab "+ (index+1).toString()}/>)}
        </Tabs>
        {this.state.searchData.map((value,index) => 
          <TabPanel value={this.state.tabState} index={index}>
            <ListBody 
              entries={this.state.itemData} 
              moveEntriesGenerator={this.moveEntriesFuncGenerator}
              onUpdateTask={this.updateTask}
              deleteFactory={this.deleteFactory}
              tagCloud={this.state.tabCloud}
              searchTags={value}
              onUpdateSearch={handleSearch}
              onCreate={this.createTask}/>
          </TabPanel>)}
      </React.Fragment>
    );
  }
}
export default SearchPanel
