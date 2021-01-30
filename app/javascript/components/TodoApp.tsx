import React from "react"
import TagCloud from "./TagCloud"
import {TagJson, TagData, ItemJson, generateTempId, SearchTabJson, UserJson, StateJson, TotalStateJson} from "./ModelTypes"
import {ItemDataProps} from "./Item"
import SearchPanel, {ItemStore, SearchTabDataProp, 
    SearchTabStore, updateItemStoreFunc, updateTabStoreFunc} from "./SearchPanel"
import UserControl from "./UserControl"
import { user_index, user_url } from "./Routes"
import IconButton from "@material-ui/core/IconButton"
import CloseIcon from "@material-ui/icons/Close";
import Snackbar from "@material-ui/core/Snackbar"

interface Props {
  tags: TagJson[]
  items: ItemJson[]
  tabs: SearchTabJson[]
  user: UserJson
};

interface State {
  user: UserJson
  tagCloud:Map<number,TagData>
  tagState:string[],//TODO: Figure this out if have time, or delete
  itemStore: ItemStore,
  searchStore: SearchTabStore,
  reverseTagLookup:Map<string,number>,
  saved: boolean,
  snackbarOpen: boolean
};
class TodoApp extends React.Component<Props,State> {
  buildFullNames (dataStruct:Map<number,TagData>) {
    let built: Map<number,string> = new Map<number,string>();
    while (built.size < dataStruct.size){
      dataStruct.forEach((value, id) => {
        if (value.tags_id != null){
          let parentTag = built.get(value.tags_id);
          if (parentTag != null){
            built.set(id, parentTag + ":" + value.name);
          }
        } else {
          built.set(id, value.name);
        }
      });
    }
    for (let [id, fullName] of built.entries()) {
      let oldData = dataStruct.get(id);
      oldData.cachedFullName = fullName;
      dataStruct.set(id, oldData);
    }
    return dataStruct;
  }
  generateReverseLookup(dataStruct:Map<number,TagData>):Map<string,number>{
    let reverse = new Map<string,number>()
    for(const [key,value] of dataStruct){
      reverse.set(value.cachedFullName, key);
    }
    return reverse;
  }
  tagState(){
    let state = this.state;
    let tags: TagJson[] = [];
    for(let [key, value] of state.tagCloud){
      tags.push({id: key, name: value.name, tags_id: value.tags_id})
    }
    return tags;
  }
  itemState(){
    let state = this.state;
    let items: ItemJson[] = [];
    state.itemStore.itemOrder.forEach(id => {
      let value = state.itemStore.itemDataMap.get(id);
      items.push({
        id: id, 
        done: value.done, 
        task: value.task, 
        tag_ids: value.tags.map(x => this.reverseLookUp(x)),
      });
    });
    return items;
  }
  searchState(){
    let state = this.state;
    let search: SearchTabJson[] = [];
    state.searchStore.tabOrder.forEach(id => {
      let value = state.searchStore.tabDataMap.get(id);
      search.push({
        id: id,
        name: value.name,
        tag_ids: value.tags.map(x => this.reverseLookUp(x)),
      })
    })
    return search;
  }
  fullState():StateJson{
    return {tags: this.tagState(), items: this.itemState(), tabs: this.searchState()};
  }

  reloadState(newProps:TotalStateJson){
    var tagCloud = new Map<number,TagData>();
    newProps.tags.forEach(element => {
      tagCloud.set(element.id, {name: element.name, tags_id: element.tags_id})
    });
    tagCloud = this.buildFullNames(tagCloud)
    const itemData = new Map<number,ItemDataProps>();
    const itemOrder: number[] = [];
    newProps.items.forEach(element => {
      let tagNames = element.tag_ids.map(tag => tagCloud.get(tag).cachedFullName);
      itemData.set(element.id, {done: element.done, task: element.task, tags: tagNames});
      itemOrder.push(element.id);
    })
    const itemStore:ItemStore = {itemDataMap: itemData, itemOrder: itemOrder};

    const searchMap = new Map<number,SearchTabDataProp>();
    let searchOrder:number[] = []
    newProps.tabs.forEach(element => {
      let tagNames = element.tag_ids.map(tag => tagCloud.get(tag).cachedFullName);
      searchMap.set(element.id, {name: element.name, tags: tagNames});
      searchOrder.push(element.id);
    })

    this.setState(prev => {
      return {//TODO: Make tabState part of user, and make data for default user = 2
        searchStore: {tabDataMap: searchMap, tabOrder: searchOrder, tabState: prev.searchStore.tabState}, 
        tagCloud: tagCloud,
        itemStore: itemStore,
        user: newProps.user,
        reverseTagLookup: this.generateReverseLookup(tagCloud),
        saved: true,
      };
    });
  }

  signalFailureToSave(){
    this.setState({snackbarOpen:true});
  }

  handleNewUser(user:string){
    const url = user_index(user);
     fetch(url, {method: 'POST', 
                 headers:{'Content-Type': 'application/json'}, 
                 body: JSON.stringify(this.fullState())})
     .then(res => res.json())
       .then(
         (results) => {
            this.reloadState(results)
         },
         (_error) => {this.signalFailureToSave()}
       )
  }
  saveCurrentContent(){
    const url = user_url(this.state.user.id);
     fetch(url, {method: 'PATCH', 
                 headers:{'Content-Type': 'application/json'}, 
                 body: JSON.stringify(this.fullState())})
     .then(res => res.json())
       .then(
         (results) => {
            this.reloadState(results)
         },
         (_error) => {this.signalFailureToSave()}
       )
  }
  constructor(props: Props | Readonly<Props>) {
    super(props);
    var tagCloud = new Map<number,TagData>();
    props.tags.forEach(element => {
      tagCloud.set(element.id, {name: element.name, tags_id: element.tags_id})
    });
    tagCloud = this.buildFullNames(tagCloud)
    const itemData = new Map<number,ItemDataProps>();
    const itemOrder: number[] = [];
    props.items.forEach(element => {
      let tagNames = element.tag_ids.map(tag => tagCloud.get(tag).cachedFullName);
      itemData.set(element.id, {done: element.done, task: element.task, tags: tagNames});
      itemOrder.push(element.id);
    })
    const itemStore:ItemStore = {itemDataMap: itemData, itemOrder: itemOrder};

    const searchMap = new Map<number,SearchTabDataProp>();
    let searchOrder:number[] = []
    props.tabs.forEach(element => {
      let tagNames = element.tag_ids.map(tag => tagCloud.get(tag).cachedFullName);
      searchMap.set(element.id, {name: element.name, tags: tagNames});
      searchOrder.push(element.id);
    })

    this.state = {//TODO: Make tabState part of user, and make data for default user = 2
      searchStore: {tabDataMap: searchMap, tabOrder: searchOrder, tabState: 0}, 
      tagCloud: tagCloud,
      tagState: [],
      itemStore: itemStore,
      user: props.user,
      reverseTagLookup: this.generateReverseLookup(tagCloud),
      saved: props.user.username != "default",
      snackbarOpen: false,
    }
    this.handleNewUser = this.handleNewUser.bind(this);
    this.saveCurrentContent = this.saveCurrentContent.bind(this);
  }
  extractCachedNames(){
    let cloud = this.state.tagCloud;
    return Array.from( cloud.values() ).map(value => value.cachedFullName);
  }

  reverseLookUp(fullTag:string){
    if (fullTag === null) return null;
    return this.state.reverseTagLookup.get(fullTag);
  }
  render () {
    const state = this.state;
    const onCreate = (domain:string, newName:string) =>
      this.setState((prev) => {
        let newIndex:number = generateTempId(prev.tagCloud);
        prev.tagCloud.set(newIndex, {
          name: newName,
          tags_id: this.reverseLookUp(domain.slice(0,-1)),
          cachedFullName: domain+newName, })
        return {
          tagCloud: prev.tagCloud, 
          reverseTagLookup: this.generateReverseLookup(prev.tagCloud), 
          saved: false
        }
      });
    const onUpdate = (originalTag:string, newName:string) =>
      this.setState((prev) =>{
        const index = this.reverseLookUp(originalTag);
        let data = prev.tagCloud.get(index);
        data.name = newName
        prev.tagCloud.set(index,data);
        let tagCloud = this.buildFullNames(prev.tagCloud);
        const transformString = (old:string):string => 
          tagCloud.get(this.reverseLookUp(old)).cachedFullName;
        
        let itemMap = prev.itemStore.itemDataMap;
        for (let [key,value] of itemMap ){
          value.tags = value.tags.map(e => transformString(e));
          itemMap.set(key, value);
        }
        let searchMap = prev.searchStore.tabDataMap;
        for (let [key,value] of searchMap ){
          value.tags = value.tags.map(e => transformString(e));
          searchMap.set(key, value);
        }
        return {
          tagCloud: tagCloud, 
          itemStore: prev.itemStore, 
          searchStore: prev.searchStore,
          reverseTagLookup: this.generateReverseLookup(tagCloud), 
          saved: false};
      });
    const onDestroy = (deleteTarget:string) => {
      this.setState((prev) => {
        let deleteIdTargets = [this.reverseLookUp(deleteTarget)];
        let deleteNameTargets = [deleteTarget] //To comb through other data structures
        let cloud = prev.tagCloud;
        for(let i = 0; i < deleteIdTargets.length; i+=1){
          let target = deleteIdTargets[i]
          deleteNameTargets.push(cloud.get(target).cachedFullName)
          cloud.delete(target)
          for(let [key,value] of cloud){
            if (value.tags_id == target){
              deleteIdTargets.push(key);
            }
          }
        }
        let itemMap = prev.itemStore.itemDataMap;
        for (let [key,value] of itemMap ){
          value.tags = value.tags.filter(e => !deleteNameTargets.includes(e));
          itemMap.set(key, value);
        }
        let searchMap = prev.searchStore.tabDataMap;
        for (let [key,value] of searchMap ){
          value.tags = value.tags.filter(e => !deleteNameTargets.includes(e));
          searchMap.set(key, value);
        }
        return {tagCloud: cloud, itemStore: prev.itemStore, searchStore: prev.searchStore, saved: false};
      })
    }

    const handleItemStoreUpdate = (updater: updateItemStoreFunc) => {
      this.setState((prev) => {
        return {itemStore: updater(prev.itemStore), saved: false}
      })
    }

    const handleSearchStoreUpdate = (updater: updateTabStoreFunc) => {
      this.setState((prev) => {
        return {searchStore: updater(prev.searchStore), saved: false}
      })
    }
    
    const closeSnackBar = () => this.setState({snackbarOpen: false});

    return (
      <React.Fragment>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.snackbarOpen}
          autoHideDuration={4500}
          onClose={closeSnackBar}
          message="Unable to Save Data"
          key={'Snackbar Fail'}
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={closeSnackBar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
        <UserControl 
          username={state.user.username} 
          onNewUser={this.handleNewUser} 
          onSave={this.saveCurrentContent}
          saved={this.state.saved}
        />
        <TagCloud 
          tagCloud={this.extractCachedNames()}
          tagSelection={state.tagState}
          onCreate={onCreate}
          onUpdate={onUpdate}
          onDestroy={onDestroy}
        />
        <SearchPanel 
          searchData={state.searchStore}
          onTabStoreUpdate={handleSearchStoreUpdate}
          itemStore={state.itemStore} 
          onItemStoreUpdate={handleItemStoreUpdate} 
          tagCloud={Array.from(state.tagCloud.values()).map(x => x.cachedFullName)}
        />
      </React.Fragment>
    );
  }
}

export default TodoApp
