interface _hospitalUser{
  _id: string,
  nombre: string,
  img: string,
}


export class Hospital{

  constructor(
    public _nombre?: string,
    public _id?: string,
    public img?: string | undefined,
    public usuario?: _hospitalUser,


  ){}

}

export interface HospitalInterface {
  ok: boolean
  hospitales: Hospitales[]
  uid: string
}

export interface Hospitales{

  _id: string,
  nombre: string,
  usario: _hospitalUser,
}
