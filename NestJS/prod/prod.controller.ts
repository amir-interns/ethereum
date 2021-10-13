import {Res, Req,  HttpCode, Header, HttpStatus, Controller, Get , Param, Post, Delete, Body, Put} from '@nestjs/common';
import {CreateProductDto, UpdateProductDto} from './dto/create-prod.dto'
import {Request, Response} from 'express'
import {ProductService} from './dto/prodService'

@Controller('prod')
export class ProdController {
  constructor (private readonly prodServ: ProductService){}

  @Get()
  getAll() {
    return this.prodServ.getAll()
    }

//   @Get()
//   getAll(@Req() req:Request, @Res() res:Response):string{
//     return 'as'
//   }
//   @Get(':id')
//   getOne(@Param() params){
//     return 'getOne' + params.id
//   }

  @Get(':id')
  getOne(@Param('id') id){
    return 'getOne' + id
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control','none')
  create(@Body() createProdDto: CreateProductDto){
     return `Title: ${createProdDto.title} Price: ${createProdDto.price}`
  }

  @Delete(':id')
  delete(@Param('id') id){
    return 'Del'+ id
  }

  @Put(':id')
  update(@Body() updateProdDto: UpdateProductDto, @Param('id') id:string){
    return 'Update' + id
  }
}