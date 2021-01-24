const baseUrl = window.location.origin + "/"; //Note, http or https must be included to keep CORS happy

export function user_index(username:string) {
    return baseUrl + `user?username=${username}`;
}
export function user_url(user_id:number) {
    return baseUrl + `user/${user_id}`;
}
export function todo_app(username:string) {
    return baseUrl + `todo_app/${username}`;
}