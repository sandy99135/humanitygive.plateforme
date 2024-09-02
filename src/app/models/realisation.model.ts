export class RealisationData {
    "id": string ;
    "realisations": [
      {
        "title": string ;
        "description": string ;
        "photo": {
            "value": string | ArrayBuffer | null | undefined ;
            "type": string ;
            "categorie": string ;
        }
      }
    ];
}

export class RealisationRemove {
  "idRealisation": string ;
  "id": string ;
}

export class RealisationUpdate {
  "id": string ;
  "title": string ;
  "description": string ;
  "photo": {
    "value": string | ArrayBuffer | null | undefined ;
    "type": string ;
    "categorie": string 
  }
}