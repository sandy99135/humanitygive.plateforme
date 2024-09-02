export class Token {
  token !: string;
  refreshToken! : string ;
  expiration! : string;
  user !: UserLog;
}

export class UserLog {
  fullName!: string;
  email! : string ;
  phoneNumber! : string;
  addresse !: string;
  type!:number;
}

