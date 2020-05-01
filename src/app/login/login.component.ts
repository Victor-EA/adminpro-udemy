import { Usuario } from './../models/usuario.model';
import { UsuarioService } from './../services/service.index';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

declare function init_plugins();
declare  const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  recuerdame: boolean = false;

  auth2: any;

  constructor( public router: Router, public _usuarioService: UsuarioService) { }

  ngOnInit(): void {

      init_plugins();

      this.googleInit();

      this.email = localStorage.getItem('email') || '';
      if (this.email.length > 1) {
        this.recuerdame = true;
      }else{
        this.recuerdame = false;
      }

    }

  googleInit(){

    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '237042604195-cvpk4q6dt7btd180hu5uothba38teb36.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSigInGoogle( document.getElementById('btnGoogle'));
    });
  }

  attachSigInGoogle( element ){

    this.auth2.attachClickHandler( element, {}, (googleUser) => {
      // let profile =  googleUser.getBasicProfile();

      let token = googleUser.getAuthResponse().id_token;

      console.log(googleUser);

      this._usuarioService.loginGoogle(token)
        .subscribe(resp => window.location.href = '#/dasboard');
    });
  }

  ingresar( forma: NgForm ){

    if (forma.invalid) {
      return;
    }

    let usuario = new Usuario( null, forma.value.email, forma.value.password );

    this._usuarioService.login( usuario, this.recuerdame)
      .subscribe( resp => this.router.navigate(['/dashboard']));
  }

}
