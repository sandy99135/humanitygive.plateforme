// import { Injectable } from '@angular/core';
// import * as localforage from 'localforage';

// @Injectable({
//   providedIn: 'root'
// })
// export class LocalforageService {

//   constructor() {
//     localforage.config({
//       name: 'App Storage'
//     });
//   }

//   async get(key: string) {
//     return await localforage.getItem(key);
//   }

//   async set(key: string, value: any) {
//     return await localforage.setItem(key, value);
//   }

//   async remove(key: string) {
//     return await localforage.removeItem(key);
//   }

//   async DELETE_ALL() {
//     return await localforage.clear();
//   }

//   async listKeys() {
//     return await localforage.keys();
//   }
// }
