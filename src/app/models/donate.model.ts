export class Donate {
       id ?: string ;
      "giver" : string ;
      "receiver" : string ;
      "type" : number ;
      "deliveryType" : number ;
      "deliveryDate" : string | Date;
      "startHours" : string ;
      "endHours" : string ;
      "contact" : string ;
      "place" : string ;
      "don" : Don[] ;
}

class Don {
    "name": string ;
    "quantity": number ;
    "rest": number
}
