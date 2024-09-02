import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bytes'
})
export class BytesPipe implements PipeTransform {

  transform(bytes: number): string {
    if (bytes === 0) {
      return '0 B';
    }

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

    return `${size} ${sizes[i]}`;
  }

}
