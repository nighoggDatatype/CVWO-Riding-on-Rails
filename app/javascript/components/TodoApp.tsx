import React from "react"
import TagCloud from "./TagCloud"
import {TagJson, TagData, ItemData} from "./ModelTypes"
import SearchPanel, {ItemStore, updateItemStoreFunc} from "./SearchPanel"

interface Props {
  tags: TagJson[]
};

interface State {
  tagCloud:Map<number,TagData>
  tagState:string[]
  itemStore: ItemStore
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
    var tempCloud = new Map<number,TagData>();
    props.tags.forEach(element => {
      tempCloud.set(element.id, {name: element.name, tags_id: element.tags_id})
    });


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
    const itemStore = {itemDataMap: testData,itemOrder: testOrder};

    this.state = {
      tagCloud: this.buildFullNames(tempCloud),
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
    const onCreate = (domain:string, newName:string) => //TODO: Replace with proper code
      this.setState((prev) => {
        let newIndex:number = null
        do{
          newIndex = Math.floor(Math.random() * 1000 * 1000);  
        }while(prev.tagCloud.get(newIndex) != null);
        prev.tagCloud.set(newIndex, {
          name: newName,
          tags_id: this.reverseLookUp(domain.slice(0,-1)),
          cachedFullName: domain+newName, })
        return {tagCloud: prev.tagCloud}
      });
    const onUpdate = (originalTag:string, newName:string) =>
      this.setState((prev) =>{
        const index = this.reverseLookUp(originalTag)
        let data = prev.tagCloud.get(index);
        data.name = newName
        prev.tagCloud.set(index,data);

        return {tagCloud: this.buildFullNames(prev.tagCloud)}
      });
    const onDestroy = (deleteTarget:string) => {
      this.setState((prev) => {
        let deleteIdTargets = [this.reverseLookUp(deleteTarget)]; //Used when deleteing item tags later
        let cloud = prev.tagCloud;
        for(let i = 0; i < deleteIdTargets.length; i+=1){
          cloud.delete(deleteIdTargets[i])
          for(let [key,value] of cloud){
            if (value.tags_id == deleteIdTargets[i]){
              deleteIdTargets.push(key);
            }
          }
        }
        return {tagCloud: cloud};
      })
    }

    const handleItemStoreUpdate = (updater: updateItemStoreFunc) => {
      this.setState((prev) => {
        return {itemStore: updater(prev.itemStore)}
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
        <SearchPanel itemStore={state.itemStore} onItemStoreUpdate={handleItemStoreUpdate} />
      </React.Fragment>
    );
  }
}

export default TodoApp
