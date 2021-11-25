import { Component, OnInit } from '@angular/core';
import { writeCookie } from '../services/helpers';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: String = '';
  senha: String = '';

  constructor() { }

  ngOnInit(): void {
  }

  verificacaoLogin() {

    setTimeout(() => {
      let payload = {
        "email": this.email,
        "password": this.senha
      }

      fetch("https://api-treinela.herokuapp.com/auth/login", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(function (res) {
        return res.json();
      }).then(function (data) {
        if (data.error == "Unauthorized") {
          alert("Login não realizado, verifique as informações digitadas!");
        } else if (data.token) {
          let decoded: any = jwt_decode(data.token);

          if (decoded.type != 'ADM') {
            alert("Você não pode acessar esta página!");
            window.location.reload();
          } else {
            writeCookie("email", decoded.email);
            writeCookie("expiresAt", decoded.exp);
            writeCookie("issuedAt", decoded.iat);
            writeCookie("id", decoded.sub);
            writeCookie("type", decoded.type);
            writeCookie("token", data.token);
            location.href = "/cursos.html";
          }
        } else {
          alert("Ocorreu um erro, contate o administrador do site!");
        }
      }).catch(function (err) {
        alert(new Error(err));
      })
    }, 500);
  }

}
