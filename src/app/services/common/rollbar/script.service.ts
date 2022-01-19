import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
 import { environment } from 'src/environments/environment';

//  import * as fs from "fs";
@Injectable({
  providedIn: 'root'
})
export class ScriptService {
  buildFolder = '../../../../www/*.js';
  url: string = "https://api.rollbar.com/api/1/sourcemap"
  
  constructor(private http: HttpClient) {
    // fs.readdir(this.buildFolder, (err, files) => {
    //   files.forEach(file => {
    //     console.log(file);
    //   });
    // });
   }
  shellCommand() {
    
    let body = {
      version: '3',
        access_token: environment.rollbarAccessToken,
        minified_url: "http://localhost:8100/main.js",
        source_map: "http://localhost:8100/main.js.map"
    }
    return this.http.post(this.url, body)
  }
}
