
export class chatDiscution {
    'contactId'!:string;
    "name"!: string;
    "profil"!: any;
    "message"!: string;
    "isRead"!: boolean;
    "date"!: string;
}

export class chatDetail {
    "id"!: string;
    "type"!: null;
    "message"!: string;
    "sender"!: string;
    "receiver"!: string;
    "profil"!: any;
    "date"!: string | Date;
    "isRead"!: boolean;
    "reaction"!: string | null;
    "position"!: string;
    "etat" !: number;
}

export class chatHeadDetail {
    "contactId" !: string;
    "profilImage" !: string | null;
    "name" !: string;
}

export class chatMessage {
    "connectionId"!: any;
    "message" !: string;
    "sender" !: string ;
    "receiver" !: string;
}

export class updateChatMessage {
    "id"!: string;
    "type"!: null;
    "message"!: string;
    "isRead"!: boolean;
    "reaction"!: string | null;
    "etat" !: number;
}






