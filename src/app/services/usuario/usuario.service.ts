import { SubirArchivoService } from './../subir-archivo/subir-archivo.service';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from './../../config/config';
import { Usuario } from './../../models/usuario.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  // tslint:disable-next-line: variable-name
  constructor(public http: HttpClient, public router: Router, public _subirArchivo: SubirArchivoService) {
    this.cargarStorage();
  }

  estaLogueado(){
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage(){
    if (localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    }else{
      this.token = '';
      this.usuario = null;
    }

  }

  guardarStorage(id: string, token: string, usuario: Usuario){
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }


  logout(){
    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  loginGoogle(token: string){
    let url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, {token})
      .pipe(map( (resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);
      }));
  }

  login( usuario: Usuario, recordar: boolean){

    if (recordar) {
        localStorage.setItem('email', usuario.email);
    }else{
        localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/login';

    return this.http.post(url, usuario)
    .pipe(map( (resp: any) => {

      this.guardarStorage(resp.id, resp.token, resp.usuario);

      return true;

    }));
  }


  crearUsuario(usuario: Usuario){

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario)
      .pipe(map((resp: any) => {
        Swal.fire({
          title: 'Usuario Creado Correctamente!',
          text: resp.usuario.email,
          icon: 'success',
          confirmButtonText: 'ok',
        });
    }));
  }

  actualizarUsuario( usuario: Usuario){
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    return this.http.put(url, usuario)
      .pipe(map( (resp: any) => {
        // this.usuario = resp.usuario;
        this.guardarStorage(resp.usuario._id, this.token, resp.usuario);
        Swal.fire({
          title: 'Usuario Actualizado Correctamente',
          text: usuario.nombre,
          icon: 'success',
          confirmButtonText: 'ok',
        });
        return true;
      }));
  }

  cambiarImagen( archivo: File, id: string){

    this._subirArchivo.subirArchivo(archivo, 'usuarios', id)
      .then( (resp: any) => {
          this.usuario.img = resp.usuario.img;
          Swal.fire({
            title: 'Imagen Actualizado',
            text: this.usuario.nombre,
            icon: 'success',
            confirmButtonText: 'ok',
          });
          this.guardarStorage(id, this.token, this.usuario);
        })
        .catch( resp => {
          console.log(resp);
        });
  }

}
