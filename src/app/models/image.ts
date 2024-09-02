export class PreviewImage {
    "name" : string;
    "size" : number;
    "src" : string;
  }

class Image {
  "value": string | undefined | null | ArrayBuffer;
  "type": string | undefined | null;
  "categorie": string | null;
}

export enum UserKeyPhotoEnum {
  PROFIL,
  COUVERTURE,
  PHOTOLOCAL
}

export class FileImage {
  "singleFile"?: Image;
  "listFile"?: Image[];
  "type": number;
  "id": string
}

export class DeleteImageModel {
  "listFile": string[];
  "id": string
}
  

  
