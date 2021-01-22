import React from "react"
import TagCloud from "./TagCloud"
import {TagJson, TagData, ItemJson} from "./ModelTypes"
import {ItemDataProps} from "./Item"
import SearchPanel, {ItemStore, updateItemStoreFunc} from "./SearchPanel"

interface Props {
  tags: TagJson[]
  items: ItemJson[]
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

    this.state = {
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
        <SearchPanel 
          itemStore={state.itemStore} 
          onItemStoreUpdate={handleItemStoreUpdate} 
          tagCloud={Array.from(state.tagCloud.values()).map(x => x.cachedFullName)}
        />
      </React.Fragment>
    );
  }
}

export default TodoApp
