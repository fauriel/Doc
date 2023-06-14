import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit{

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public formSubmitted = false;
  public auth2: any;

  loginForm: FormGroup;


  constructor(private router: Router,
              private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private ngZone: NgZone) {

                this.loginForm = fb.group({
                    email: [ localStorage.getItem('email') || '', [ Validators.required, Validators.email]],
                    password: ['', Validators.required],
                    remember: [false]
                  });
              }
  ngAfterViewInit(): void {
 this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: "891386350783-gsslpldhmjb3mj3bdbh8fp9s7o1npc72.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      //document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }
  handleCredentialResponse(response: any){
    //console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle( response.credential)
    .subscribe( resp => {
      //console.log( {login: resp})
      this.router.navigateByUrl('/')
    })

  }
  ngOnInit(): void {

  }

  login() {

    this.usuarioService.login( this.loginForm.value)
    .subscribe(resp => {
      if( this.loginForm.get('remember')?.value){
        localStorage.setItem('email', this.loginForm.get('email')?.value)
      } else {
        localStorage.removeItem('email')
      }
//Naveegar al dashboard
        this.router.navigateByUrl('/')

    }, (err) => {
      Swal.fire('Error', err.error.msg, 'error')

     })
    //this.router.navigateByUrl('/')
  }

}
