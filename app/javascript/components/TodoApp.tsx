import React from "react"
import TagCloud from "./TagCloud"
import {TagJson, TagData, ItemJson, generateTempId, SearchTabJson, UserJson} from "./ModelTypes"
import {ItemDataProps} from "./Item"
import SearchPanel, {ItemStore, SearchTabDataProp, 
    SearchTabStore, updateItemStoreFunc, updateTabStoreFunc} from "./SearchPanel"

interface Props {
  tags: TagJson[]
  items: ItemJson[]
  tabs: SearchTabJson[]
  user: UserJson[]
};

interface State {
  tagCloud:Map<number,TagData>
  tagState:string[],
  itemStore: ItemStore,
  searchStore: SearchTabStore,
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
      let tagNames = element.tags.map(tag => tagCloud.get(tag).cachedFullName);
      itemData.set(element.id, {done: element.done, task: element.task, tags: tagNames});
      itemOrder.push(element.id);
    })
    const itemStore:ItemStore = {itemDataMap: itemData, itemOrder: itemOrder};

    const searchMap = new Map<number,SearchTabDataProp>();
    let searchOrder:number[] = []
    props.tabs.forEach(element => {
      let tagNames = element.tags.map(tag => tagCloud.get(tag).cachedFullName);
      searchMap.set(element.id, {name: element.name, tags: tagNames});
      searchOrder.push(element.id);
    })

    this.state = {//TODO: Make tabState part of user, and make data for default user = 2
      searchStore: {tabDataMap: searchMap, tabOrder: searchOrder, tabState: 0}, 
      tagCloud: tagCloud,
      tagState: [],
      itemStore: itemStore,
    }
  }
  extractCachedNames(){
    let cloud = this.state.tagCloud;
    return Array.from( cloud.values() ).map(value => value.cachedFullName);
  }

  reverseLookUp(fullTag:string){
    if (fullTag === null) return null;
    for(let [id,data] of this.state.tagCloud){
      if (data.cachedFullName == fullTag){
        return id;
      }
    }
    return;
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
        return {tagCloud: prev.tagCloud}
      });
    const onUpdate = (originalTag:string, newName:string) =>
      this.setState((prev) =>{
        const reverseIndex = new Map<string,number>()
        for (let [key,value] of prev.tagCloud ){
          reverseIndex.set(value.cachedFullName, key);
        }
        const index = reverseIndex.get(originalTag);
        let data = prev.tagCloud.get(index);
        data.name = newName
        prev.tagCloud.set(index,data);
        let tagCloud = this.buildFullNames(prev.tagCloud);
        const transformString = (old:string):string => 
          tagCloud.get(reverseIndex.get(old)).cachedFullName;
        
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
        return {tagCloud: tagCloud, itemStore: prev.itemStore, searchStore: prev.searchStore};
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
        return {tagCloud: cloud, itemStore: prev.itemStore, searchStore: prev.searchStore};
      })
    }

    const handleItemStoreUpdate = (updater: updateItemStoreFunc) => {
      this.setState((prev) => {
        return {itemStore: updater(prev.itemStore)}
      })
    }

    const handleSearchStoreUpdate = (updater: updateTabStoreFunc) => {
      this.setState((prev) => {
        return {searchStore: updater(prev.searchStore)}
      })
    }

    return (
      <React.Fragment>
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
