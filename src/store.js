
import {BehaviorSubject} from 'rxjs';

//Creating an observable
//If there is a token in local storage, get it. Else, set the value to null.
export const token$ = new BehaviorSubject(window.localStorage.getItem("token") || null);

export function updateToken(newToken) {
  //Storing token in local storage
  //If the new token is null, remove token from local storage
  if (!newToken) {
    window.localStorage.removeItem("token");
  } else {
    window.localStorage.setItem('token', newToken);
  }

  //Updating observable
  token$.next(newToken);

  // console.log('newToken in updateToken:');
  // console.log(newToken);
}
