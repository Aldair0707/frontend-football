export class Reaccion {
  id: number;
  description: EReaction; // El tipo de reacción que es un enum
  usuario: string; // Nombre del usuario que hizo la reacción
  publicacionId: number; // ID de la publicación asociada

  constructor(
    id: number,
    description: EReaction,
    usuario: string,
    publicacionId: number
  ) {
    this.id = id;
    this.description = description;
    this.usuario = usuario;
    this.publicacionId = publicacionId;
  }
}

export enum EReaction {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
  GOAT = 'GOAT'
}
