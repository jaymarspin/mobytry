export class AuthParam {
  public authConfig: string;
  public authUrl: string;
  public tokenUrl: string;
  public clientId: string;
  public redirectUrl: string;
  public selectedScopes: string;
  public additionalParam: { [key: string]: string };
  public platform: string;
  public discoveryUrl: string;
  public audience: string;
  public logoutUrl: string;
  public iosWebView: string;
  public clientSecret: string;
}
