export class ReceiverMixte {
    "email" : string;
    "type" : number;
    "notification" : boolean;
    "fullName" : string ;
    "sectorActivity" : string ;
    "apparenceYear": number ;
    "province" : string;
    "region" : string;
    "district" : string;
    "commune" : string;
    "fokotany" : string;
    "addresse" : string;
    "password" : string ;
    "phoneNumber" : string 
  }

export class AssociationTeamInfo {
  "headFullname" : string;
  "teamNumber" : number;
  "chargeNumber" : number;
  "implantationNumber" : number ;
  "number" : number ;
  "content": string ;
  "state" : string;
  "place" : string;
};

export class NearReceiverModel {
    "province": string ;
    "region": string ;
    "district": string ;
    "commune": string ;
    "fokotany": string ;
};

export class DetailReceiverMixte {
  'addresse' : number ;
  'apparenceYear': number ;
  'associationTeamInfo' : AssociationTeamInfo ;
  'biography' : string ;
  'commune' : string ;
  'dateCreation' : string ;
  'difficulty' : string ;
  'district' : string ;
  'email' :  string ;
  'fokotany' : string ;
  'fullName' : string ;
  'historySteps' : any[] ;
  'id' : string ;
  'isProfessional' : boolean ;
  'isValid' : boolean ;
  'localPictures' : any[]
  'mission' :  string ;
  'partenaires' : any[];
  'password' : string;
  'phoneNumber' : number ;
  'picture' : any ;
  'place':any;
  'province' : string ;
  'realisations' :  any[];
  'region' : string;
  'sectorActivity' : number ;
  'teamInfos' : any ;
  'teamNumber' : any ;
  'type' : number;
  'website' : string;
  'need' : string ;
    
  }
  
  