export interface TagData {
  name:string,
  tags_id?:number,
  cachedFullName?:string,
}

export interface TagJson extends TagData {
  id:number,
}
