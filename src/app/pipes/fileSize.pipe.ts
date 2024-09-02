import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {
  transform(value: number): string {
    if (value === 0) return '0 Bytes';

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = parseInt(String(Math.floor(Math.log(value) / Math.log(1024))));
    return Math.round(value / Math.pow(1024, i)) + ' ' + sizes[i];
  }
}
