export class Comentario {
  id: number = 0;
  texto: string = '';
  autor: string = '';
  fechaCreacion: Date = new Date();

  constructor(id: number, texto: string, autor: string, fechaCreacion: Date) {
    this.id = id;
    this.texto = texto;
    this.autor = autor;
    this.fechaCreacion = fechaCreacion;
  }
}
