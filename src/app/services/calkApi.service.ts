import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CalkApiService {

  urlSearch:string = "http://localhost:3000"
  resultado:string = ""

  constructor( private http:Http ) { }

  getResult(path:string, params:string ){
    let url = this.urlSearch+`/${path}/${params}`
    console.log(url)
    return this.http.get(url)
      .map( res=>{
        console.log(res.json() )
        this.resultado = res.json().resultado
        return res.json()
      })
  }

}
