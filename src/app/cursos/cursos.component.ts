import { Component, OnInit } from '@angular/core';
import { readCookie } from '../services/helpers';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit {

  cursos: any[] = [];

  editando: boolean = false;
  adicionando: boolean = false;

  cursoEditando = {
    _id: '',
    name: '',
    duration: 0
  }

  constructor() { }

  ngOnInit(): void {
    this.carregarCursos();
  }

  async carregarCursos() {
    this.cursos = [];
    this.cursos = await fetch("https://api-treinela.herokuapp.com/course/", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + readCookie("token")
      }
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      if (data.length > 0) {
        return data;
      }
    }).catch(function (err) {
      //LÓGICA PARA RETURN ERROR

      alert(new Error(err));
    });
  }

  editaCurso(i: any) {
    if (i) {
      this.editando = true;
      this.cursoEditando.duration = i.duration;
      this.cursoEditando.name = i.name;
      this.cursoEditando._id = i._id;
    } else {
      this.adicionando = true;
    }
  }

  voltar() {
    this.editando = false;
    this.adicionando = false;
    this.cursoEditando.duration = 0;
    this.cursoEditando.name = '';
    this.cursoEditando._id = '';

    this.carregarCursos();
  }

  async deletar() {
    const result = await fetch("https://api-treinela.herokuapp.com/course/" + this.cursoEditando._id, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + readCookie("token")
      },
      body: JSON.stringify(this.cursoEditando)
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      if (data.error == "Unauthorized") {
        alert("Você não tem autorização para fazer essa alteração!");
        return 'error';
      } else if (data.error) {
        alert("Ocorreu um erro, contate o administrador do site!");
        return 'error';
      } else {
        return 'ok';
      }
    }).catch(function (err) {
      //LÓGICA PARA RETURN ERROR
      alert(new Error(err));
    });

    if (result == 'ok') {
      this.voltar();
    }
  }

  async salvar() {
    if (this.validaCampos()) {
      if (this.cursoEditando._id != '') {
        const result = await fetch("https://api-treinela.herokuapp.com/course/" + this.cursoEditando._id, {
          method: "PUT",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + readCookie("token")
          },
          body: JSON.stringify(this.cursoEditando)
        }).then(function (res) {
          return res.json();
        }).then(function (data) {
          if (data.error == "Unauthorized") {
            alert("Você não tem autorização para fazer essa alteração!");
            return 'error';
          } else if (data.error) {
            alert("Ocorreu um erro, contate o administrador do site!");
            return 'error';
          } else {
            return 'ok';
          }
        }).catch(function (err) {
          //LÓGICA PARA RETURN ERROR
          alert(new Error(err));
        });

        if (result == 'ok') {
          this.voltar();
        }
      } else {
        const result = await fetch("https://api-treinela.herokuapp.com/course/", {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + readCookie("token")
          },
          body: JSON.stringify({ name: this.cursoEditando.name, duration: this.cursoEditando.duration })
        }).then(function (res) {
          return res.json();
        }).then(function (data) {
          if (data.error == "Unauthorized") {
            alert("Você não tem autorização para fazer essa alteração!");
            return 'error';
          } else if (data.error) {
            alert("Ocorreu um erro, contate o administrador do site!");
            return 'error';
          } else {
            return 'ok';
          }
        }).catch(function (err) {
          //LÓGICA PARA RETURN ERROR
          alert(new Error(err));
        });

        if (result == 'ok') {
          this.voltar();
        }
      }
    }
  }

  validaCampos() {
    if (isNaN(this.cursoEditando.duration) || !this.cursoEditando.duration) {
      alert("Preencha a duração corretamente!");
      return false;
    } else if (!this.cursoEditando.name || this.cursoEditando.name == '') {
      alert("Preencha o nome do curso corretamente!");
      return false;
    } else {
      return true;
    }
  }


}
