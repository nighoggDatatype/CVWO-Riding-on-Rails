import React from "react"
import ListBody from "./ListBody"
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import {itemRecordProps, updateFunc} from "./Item";

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
  tabData: itemRecordProps[][]
  tabState:number
}

class SearchPanel extends React.Component<Props,State> {
  lookupById(tabId: number){
    return (id: number) => this.state.tabData[tabId].findIndex((value) => value.id == id);
  }
  moveEntriesFuncGenerator(tabId:number){
    let lookup = this.lookupById(tabId);
    return (srcId: number, dstId: number) => () => this.setState(prevState => {
      let data = prevState.tabData[tabId];
      let src = lookup(srcId);
      let dst = lookup(dstId);
      let temp = data[src];
      data[src] = data[dst];
      data[dst] = temp;
      prevState.tabData[tabId] = data
      return {tabData: prevState.tabData};
    });
  }
  updateTaskFactory(tabId: number){
    let lookup = this.lookupById(tabId);
    return (id: number, func: updateFunc) => 
      this.setState(prev => {
        let entries = prev.tabData[tabId];
        let identity = lookup(id);
        prev.tabData[tabId][identity] = {id: id, ...func(entries[identity])};
        return {tabData: prev.tabData};
      });
  }
  deleteFactory(tabId: number){
    let lookup = this.lookupById(tabId);
    return (id: number) => () => {
      let index = lookup(id);
      if (index > -1){
        this.setState(prev =>{
          prev.tabData[tabId].splice(index,1);
          return {tabData:prev.tabData};
        })
      }
    };
  }

  constructor(props) {
    super(props);
    const longFillerText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, "
      + "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
      + "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
      + "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
      + "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    const longTagList = ["Monday", "Pets", "PraiseMami", "DabHarder", "Dab", "MemesMemesMemes", "OhGodWhy", "AO3Tags", "Ipsum", "Lorem", "Tabs"];
    const testData = 
      [{ id: 1111, done:false, task:"Go Jog", tags:["Monday"] }
      ,{ id: 888, done:true, task:longFillerText, tags:["Latin"] }
      ,{ id: 1234, done:true, task:"Walk the Dog", tags:longTagList}
    ]
    const testList = [testData,testData,testData];
    this.state = {
      tabData: testList,
      tabState: 2
    }
  }
  render () {
    const handleChange = (_event, newValue) => {
      this.setState({tabState: newValue});
    };
    return (
      <React.Fragment>
        <Tabs value={this.state.tabState} onChange={handleChange}>
          {this.state.tabData.map((_value,index) => <Tab id={index.toString()} label={"Tab "+ (index+1).toString()}/>)}
        </Tabs>
        {this.state.tabData.map((value,index) => 
          <TabPanel value={this.state.tabState} index={index}>
            <ListBody 
              entries={value} 
              moveEntriesGenerator={this.moveEntriesFuncGenerator(index)}
              onUpdateTask={this.updateTaskFactory(index)}
              deleteFactory={this.deleteFactory(index)}/>
          </TabPanel>)}
        Garbage: {this.props.garbage}
        Tab: {this.state.tabState}
      </React.Fragment>
    );
  }
}
export default SearchPanel
