import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor() { }

  paginate (arr: any[], size: number) {
    return arr.reduce((acc: any[][], val: any, i: number) => {
      let idx = Math.floor(i / size)
      let page = acc[idx] || (acc[idx] = [])
      page.push(val)

      return acc
    }, [])
  }
 
}
