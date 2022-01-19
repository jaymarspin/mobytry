export class User {
  public isLoggedIn: boolean;
  public accessToken: string;
  public instanceUrl: string;
  public idToken: string;
  public userUrl: string;
  public isSandbox: string;
  public accessExpiry: Date;
  public refreshToken: string;
  public userId: string;
  public name: string;
  public permissions: string[];
  public company: Company[];
  public companyName: string;
  public teamName: string;
  public userPhoto: string;
}

export class UserInfo extends User {
  public companyName: string;
  public teamName: string;
  public userPhoto: string;
}

export class Company {
  public Name: string;
  public Id: string;
  public Abbreviation: string;
}
