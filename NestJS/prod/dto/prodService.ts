import {Injectable} from '@nestjs/common'

@Injectable()
export class ProductService{
  private prods=['oran','appl']

  getAll(){
    return this.prods
  }

//   getById(id:string){
//     return this.prods.find(predicate p=> p.id===id)
//   }


}