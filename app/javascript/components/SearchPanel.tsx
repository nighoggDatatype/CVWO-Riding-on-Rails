import React from "react"
import ListBody from "./ListBody"
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

interface Props {
  garbage:string,
}

interface State {
  tabState:string
}

function TabPanel(props: { [x: string]: any; children: any; value: string; index: string; }) {
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

class SearchPanel extends React.Component<Props,State> {
  constructor(props) {
    super(props);
    this.state = {
      tabState: '2'
    }
  }
  render () {
    const longFillerText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, "
      + "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
      + "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
      + "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
      + "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    const longTagList = ["Monday", "Pets", "PraiseMami", "DabHarder", "Dab", "MemesMemesMemes", "OhGodWhy", "AO3Tags", "Ipsum", "Lorem", "Tabs"];
    const testData = {entries: 
      [{ id: 1111, done:false, task:"Go Jog", tags:["Monday"] }
      ,{ id: 888, done:true, task:longFillerText, tags:["Latin"] }
      ,{ id: 1234, done:true, task:"Walk the Dog", tags:longTagList}
    ]}
    const testList = [testData,testData,testData];

    const handleChange = (event, newValue) => {
      this.setState({tabState: newValue});
    };
    return (
      <React.Fragment>
        <Tabs value={this.state.tabState} onChange={handleChange}>
          {testList.map((value,index) => <Tab id={index.toString()} label={"Tab "+ (index+1).toString()}/>)}
        </Tabs>
        {testList.map((value,index) => <TabPanel value={this.state.tabState} index={index.toString()}><ListBody {...value}/></TabPanel>)}
        Garbage: {this.props.garbage}
        Tab: {this.state.tabState}
      </React.Fragment>
    );
  }
}
export default SearchPanel
