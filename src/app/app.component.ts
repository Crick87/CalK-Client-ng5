import { Component } from '@angular/core';
import {CalkApiService} from './services/calkApi.service';
import { OnInit } from '@angular/core';

let Waves:any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  functionName:string = ""
  display:any = "0"
  displayHelp:string = ""
  valorSec:any = ""
  icon:string
  mode:string = "rad"
  modeAlt:string = "grad"

  ngOnInit() {
  }

  constructor( private calkService:CalkApiService) { }

  ObtenerResultado(){
      switch(this.functionName) {
         case "potencia": {
             if( this.valorSec == "")
             {
               this.valorSec = this.display
               this.displayHelp = "Exponente:"
               this.display = "0"
             }else{
               this.displayHelp = ""
               let displayOld = this.display
               this.Parametros2()
               this.functionName = `${this.functionName}(${this.valorSec})^${displayOld}`
               this.valorSec = ""
             }
             break;
         }
         case "logaritmo": {
             if( this.valorSec == "")
             {
               this.valorSec = this.display
               this.displayHelp = "Argumento:"
               this.display = "0"
             }else{
               this.displayHelp = ""
               let displayOld = this.display
               this.Parametros2()
               this.functionName = `${this.functionName} ${this.valorSec} (${displayOld})`
               this.valorSec = ""
             }
             break;
         }
         case "cuadrado": {
             this.valorSec = this.display
             this.display = "2"
             this.functionName = "potencia"
             this.Parametros2()
             this.functionName = `${this.functionName}(${this.valorSec})^2`
             this.valorSec = ""
             break;
         }
         case "suma":
         case "resta":
         case "multiplicacion":
         case "division": {
           if( this.valorSec == "")
           {
             this.valorSec = this.display
             switch(this.functionName){
               case "suma":{
                 this.icon = "+"
                 break;
               }
               case "resta":{
                 this.icon = "-"
                 break;
               }
               case "multiplicacion":{
                 this.icon = "*"
                 break;
               }
               case "division":{
                 this.icon = "/"
                 break;
               }
             }
             this.displayHelp = this.icon
             this.display = "0"
           }else{
             this.displayHelp = ""
             let displayOld = this.display
             this.Parametros2()
             this.functionName = `${this.functionName} ${this.valorSec} ${this.icon} ${displayOld}`
             this.valorSec = ""
           }
           break;
         }
         case "seno":
         case "coseno":
         case "tangente":
         case "cotangente":
         case "secante":
         case "cosecante": {
           if( this.mode == "grad")
           {
             this.TrigonometricasGrados()
             break;
           }
         }
         default: {
            this.Parametros1()
            break;
         }
      }
  }

  Parametros1(){
    if (this.display != "") {
      this.calkService.getResult(this.functionName, this.display).subscribe(
        (jsonData) => {
          let displayOld = this.display
          this.display = this.calkService.resultado
          this.functionName = `${this.functionName}(${displayOld})`
        }
      )
    }
  }

  Parametros2(){
    if (this.display != "") {
      this.calkService.getResult(this.functionName, `${this.valorSec}/${this.display}`).subscribe(
        (jsonData) => {
          this.display = this.calkService.resultado
        }
      )
    }
  }

  TrigonometricasGrados(){
    if (this.display != "") {
      this.calkService.getResult("grad2rad", this.display).subscribe(
        (jsonData) => {
          this.calkService.getResult(this.functionName, this.calkService.resultado).subscribe(
            (jsonData) => {
              this.calkService.getResult("rad2grad", this.calkService.resultado).subscribe(
                (jsonData) => {
                  let displayOld = this.display
                  this.display = this.calkService.resultado
                  this.functionName = `${this.functionName}(${displayOld})`
                }
              )
            }
          )
        }
      )
    }
  }

  SetPotencia(){
    this.functionName = "potencia"
    this.displayHelp = "Base:"
  }
  SetLogaritmo(){
    this.functionName = "logaritmo"
    this.displayHelp = "Base:"
  }
  SetSuma(){
    this.functionName = "suma"
  }
  SetResta(){
    this.functionName = "resta"
  }
  SetMultiplicacion(){
    this.functionName = "multiplicacion"
  }
  SetDivision(){
    this.functionName = "division"
  }

  CambiarSigno(){
    this.display = this.display * (-1)
  }

  Display( number:string ){
    if(this.display=="0"){
      this.display = number
    }else{
      this.display = `${this.display}${number}`
    }
  }

  Clear(){
    this.display = "0"
    this.functionName = ""
    this.displayHelp = ""
    this.valorSec = ""
  }

  SetMode(){
    if(this.mode == "rad"){
      this.mode = "grad"
      this.modeAlt = "rad"
      this.calkService.getResult("rad2grad", this.display).subscribe(
        (jsonData) => {
          this.display = this.calkService.resultado
        }
      )
    }else{
      this.mode = "rad"
      this.modeAlt = "grad"
      this.calkService.getResult("grad2rad", this.display).subscribe(
        (jsonData) => {
          this.display = this.calkService.resultado
        }
      )
    }
  }

}
