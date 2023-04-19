import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: ['./promesas.component.css']
})
export class PromesasComponent implements OnInit {

  ngOnInit(): void {
    this.getUsuarios().then(usuarios => {
      
    })
    /*const promesa = new Promise((resolve, reject) => {

      if (true) {
        resolve
      } else {
        reject
      }
    });*/

  }
  getUsuarios(){
const promesa = new Promise(resolve => {
  fetch('https://reqres.in/api/users')
  .then(resp => resp.json())
  .then(body => resolve)

})
return promesa;
  }

}
