import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PanierService } from '../service/panier.service';
import { Panier } from '../panier.entity';

@Controller('panier')
export class PanierController {
  constructor(private panierServices: PanierService) {}
  // @Post('AddPanier1')
  // async AddPanier(@Body() body:any
  // ) {
  //   let  cartItem=body.cartItem;
  //   let id_user=body.id_user;
  //    let etat=body.etat;
  //   let prix=body.prix;
  //   let ModeRetrait=body.ModeRetrait;
  //  let  createdAt=body.createdAt;
  //  let etat_Commande=body.etat_Commande
  //  let panier:any=await this.panierServices.findPanier({
  //   where: { id_user: id_user},
  // });
  // console.log(panier[0]);
  
  // if(panier.length!==0){
  //   const lengthPanier=(Object.keys(panier[0].cartItem)).length
  //   panier[0].cartItem={...panier[0].cartItem,[lengthPanier]:cartItem}
  //   cartItem=panier[0].cartItem
  //   let prixTotal=Number(panier[0].prix)+Number(prix)
  //   console.log({prixTotal});
    
  //   return this.panierServices.updatePanier(id_user, cartItem,prixTotal,etat,etat_Commande,createdAt,ModeRetrait);
  // }
  // else{
  //   cartItem={"0":cartItem}
  //   return this.panierServices.createPanier({ cartItem, id_user, etat, prix,ModeRetrait,createdAt, etat_Commande });
  // }
   
  // }

  @Post('AddPanier')
  async AddPanier(
    @Body('cartItem') cartItem: string,
    @Body('id_user') id_user: number,
    @Body('etat') etat: string,
    @Body('prix') prix: number, 
    @Body('ModeRetrait')  ModeRetrait:string,
    @Body('createdAt')  createdAt ,
    @Body('etat_commande') etat_commande:string,


  ) {
    return this.panierServices.createPanier({ cartItem, id_user, etat, prix,ModeRetrait,createdAt, etat_commande });
  }
  

  @Get(':id')
  async panier(@Param('id') id_user: number) {
    try {
      const panier = await this.panierServices.findPanier({
        where: { id_user: id_user, etat_Commande: 'En cour de préparation' },
      });
      console.log(panier);

      return panier;
      
    } catch (e) {
      return { message: 'Get panier error:', e };
    }
  }
  @Get('commande/:id')
  async commande(@Param('id') id_user: number) {
    try {
      const commande = await this.panierServices.findPanier({
        where: { id_user: id_user },
      });
      return commande;
    } catch (e) {
      return { message: 'Get commande error:', e };
    }
  }

  @Get()
  async getPanier(): Promise<Panier[]> {
    return await this.panierServices.findPanier({
      where: { etat_Commande:"En cour de préparation"},
    });
  }

  @Delete(':id')
  delete(@Param('id') id_user: number): Promise<DeleteResult> {
    return this.panierServices.deletePanier(id_user);
  }
  @Put(':id')
  async update(@Param('id') id: number, @Body('etat_Commande') etat_Commande: string) {
      this.panierServices.updateEtat(id, etat_Commande); // Passer etatCommande à la méthode updateEtat
  }

}
