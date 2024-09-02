import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map , forkJoin } from 'rxjs';
import { DeleteImageModel, FileImage } from '../models/image';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { parseGIF }  from 'gifuct-js';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

    uri: string = environment.URI;

    constructor(
        protected http: HttpClient,
        private ng2ImgMax: Ng2ImgMaxService
    ) {}

    domain = [
        this.uri,'','*'
    ];

    addImage(image : FileImage) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.post<any>(this.uri + '/api/File/picture/add', image, { 'headers': headers }).pipe(
          map((x: HttpResponse<string>) => {
            return x.status;
          })
        );
    }

    deleteImage(data: DeleteImageModel) : Observable<any> {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', this.domain);
        return this.http.post<any>(this.uri + '/api/File/picture/remove', data, { 'headers': headers })
        .pipe(
          map((x: HttpResponse<string>) => {
            return x.status;
          })
        );
    }

    compressOneImage(file: File, maxSizeInMB: number): Observable<any> {
      return new Observable<any>(observer => {
        if (file.type.startsWith('image/')) {
          this.ng2ImgMax.compressImage(file, maxSizeInMB)
            .subscribe(
              result => {
                observer.next(result);
                observer.complete();
              },
              error => {
                observer.error(error);
              }
            );
        } else {
          observer.error('Unsupported file type');
        }
      });
    }

    compressListeImages(files: File[]): Observable<any[]> {
      const compressionObservables = files.map(file =>
        new Observable<any>(observer => {
          this.ng2ImgMax.compressImage(file, 0.550)
            .pipe(
              map(compressedImage => {
                observer.next(compressedImage);
                observer.complete();
              })
            )
            .subscribe(
              () => {},
              error => observer.error(error)
            );
        })
      );
  
      return forkJoin(compressionObservables);
    }

    // compressImages(files: File[]): Observable<any[]> {
    //   const compressionObservables: Observable<any>[] = [];
  
    //   for (let i = 0; i < files.length; i++) {
    //     const file = files[i];
  
    //     if (file.type === 'image/jpeg' || file.type === 'image/png') {
    //       compressionObservables.push(
    //         new Observable<any>(observer => {
    //           this.ng2ImgMax.compressImage(file, 0.050)
    //             .pipe(
    //               map(compressedImage => {
    //                 observer.next(compressedImage);
    //                 observer.complete();
    //               })
    //             )
    //             .subscribe(() => {},error => observer.error(error));
    //         })
    //       );
    //     } else if (file.type === 'image/gif') {
    //       compressionObservables.push(this.compressGif(file));
    //     } else {
    //       console.error('Unsupported image type:', file.type);
    //     }
    //   }
  
    //   return forkJoin(compressionObservables);
    // }

    private compressGif(file: File): Observable<any> {
      return new Observable<any>(observer => {
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          const arrayBuffer = e.target.result;
          const gifData = parseGIF(arrayBuffer);
          // Implement your GIF compression logic if needed
  
          observer.next(gifData); // Return or do something with the compressed GIF data
          observer.complete();
        };
  
        reader.onerror = (error) => {
          observer.error(error);
        };
  
        reader.readAsArrayBuffer(file);
      });
    }

    convertToBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    async urlToBase64(url: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';
      
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context!.drawImage(img, 0, 0);
      
            const base64Image = canvas.toDataURL('image/png');
            resolve(base64Image);
          };
      
          img.onerror = (error) => {
            reject(error);
          };
      
          img.src = url;
        });
      }
      
      async convertImageUrlToBase64( url : string) {
      
        try {
          return await this.urlToBase64(url);
        } catch (error) {
          console.error('Error converting image:', error);
          return 
        }
      }


}
