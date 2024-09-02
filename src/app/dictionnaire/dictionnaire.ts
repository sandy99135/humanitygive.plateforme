export class Dictionnaire {
  
    donate = new Map<number, string>();
  
    constructor() {
      this.donate.set(1, "Dons monétaires");
      this.donate.set(2, "Biens matériels");
      this.donate.set(3, "alimentaires");
      this.donate.set(4, "Devenir bénévole");
    }
  
  }
  