import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
  constructor() {
  }

  get(key: string) : any {
    const itemStr = localStorage.getItem(key);
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  }

  set(key: string, val: any) {
    // Set it
    const now = new Date();

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: val,
      expiry: now.getTime() + (6 * 60 * 60 * 1000), // Set it to expire in 6 hours
    };

    localStorage.setItem(key, JSON.stringify(item))
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

}
