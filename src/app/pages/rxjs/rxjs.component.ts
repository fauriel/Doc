import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators'

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.css']
})
export class RxjsComponent {

  constructor() {

    /* this.retornaObservable().pipe(
       retry(2)
      ).subscribe(
       valor => console.log('Subs:', valor),
       error => console.warn('Error:', error),
       () => ()
          );
   */

  }

  retornaIntervalo() {

  }

  retornaObservable() {


    const obs$ = new Observable<number>(observer => {
      let i = -1;

      const intervalo = setInterval(() => {
        i++;
        observer.next(i);
        if (i === 4) {
          clearInterval(intervalo);
          observer.complete()
        }
      })
      setInterval(() => {

      }, 1000)
    })

    obs$.subscribe(
      valor => {

      });
  }

}
