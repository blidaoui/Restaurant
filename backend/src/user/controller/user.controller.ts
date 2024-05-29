import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Delete,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response, Request, request } from 'express';
import { User } from '../user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthGuard } from '@nestjs/passport';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}
// user
  @Post('register')
  async register(
    @Body('nom') nom: string,
    @Body('prenom') prenom: string,
    @Body('tele') tele: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    console.log(nom, prenom, tele, email, password);

    const hashedPassword = await bcrypt.hash(password, 12);
    return this.userService.create({
      nom,
      prenom,
      tele,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });
  }
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findOne({ where: { email } });
    console.log({user});
    
    if (!user) {
      throw new BadRequestException('invalid credentials');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('invalid credentials');
    }
    const jwt = await this.jwtService.signAsync({ user_id: user.user_id });

    response.cookie('jwt', jwt);
    return { message: 'success', statusCode: 200,data:user };
  }
  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findall();
  }

  @Get(':user_id')
  async findOne(@Param('user_id') user_id: number): Promise<User> {
    console.log(typeof(user_id));
    
    const user = await this.userService.findOne({ where: { user_id } });
    if (!user) {
      throw new Error('User not found');
    } else {
      // const cookie = request.cookies['jwt'];
      // // const data = await this.jwtService.verifyAsync(cookie);
      // if(!data){
      //     throw new BadRequestException('invalid credentials')
      // }
      return user;
    }
  }
  //update user
  @Put(':user_id')
  async update(
    @Param('user_id') user_id: number,
    @Body() user: User,
  ): Promise<User> {
    console.log({user});
    
    return this.userService.update(user_id, user);
  }
  @Put('/password/1')
  async updatePassword(
      @Body('email') email: string,
      @Body('password') password: string,
  ) {
      // Handle the case when the user is found
      const user = await this.userService.findOne({ where: { email } });
      if (!user) {
          throw new Error('User not found');
      }
      
      const hashedPassword = await bcrypt.hash(password, 12);
      await this.userService.updateUserPassword(user.user_id, hashedPassword);
      return { message: 'success' };
  }
  @Put('/password/phone')
  async updatePasswordByPhoneNumber(
      @Body('tele') tele: string,
      @Body('password') password: string,
  ) {
      // Handle the case when the user is found
      const user = await this.userService.findOne({ where: { tele } });
      if (!user) {
          throw new Error('User not found');
      }
      
      const hashedPassword = await bcrypt.hash(password, 12);
      await this.userService.updateUserPassword(user.user_id, hashedPassword);
      return { message: 'success' };
  }
  //delete user
  @Delete(':id')
  async delete(@Param('id') user_id: number): Promise<void> {
    //handle the error if user not found
    const user: any = await this.userService.findOne({ where: { user_id } });
    if (!user) {
      throw new Error('User not found');
    }
    return this.userService.delete(user);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    try {
      response.clearCookie('jwt');
      return { message: 'success' };
    } catch (e) {
      return { message: 'logout error:', e };
    }
    
  }
  @Post('checkout')
  async handleCheckout(@Body() body: { user_id: string, paymentMethodNonce: string ,TotalAmount:number}) {
    const TotalAmount=10;
      try {
          const { user_id, paymentMethodNonce } = body;
          const result = await this.userService.processCheckout(user_id, paymentMethodNonce);
          return { result };
      } catch (error) {
          console.error('Error during checkout:', error);
          return { error: error.message || 'Internal Server Error' };
      }
  }

  @Get('google/1')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req()  req){}

  @Get('auth/google/callback') 
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req  ,@Res({passthrough: true}) response :Response){
      try {
        const { user } = req;
        if (!user) {
            throw new BadRequestException('Google authentication failed');
        }

        // Check if the user already exists
        let existingUser = await this.userService.findOne({ where: { email: user.email } });
        if (!existingUser) {
        
        // Register new user
                 existingUser = await this.userService.create({
                  nom: user.firstName,
                  prenom:user.lastName,
                  email:user.email,
                  createdAt: new Date(),
              });
          }

          // Generate JWT token
          const jwt = await this.jwtService.signAsync({ user_id: existingUser.user_id });
          response.cookie('jwt', jwt);
          return response.redirect('http://localhost:3000/');
        } catch (error) {
          console.error(error);
          response.status(500).json({ error: 'Internal Server Error' });
        }
  }

  @Post('send-email/1')
  async sendEmail(
      @Body('to') to: string,
      @Body('subject') subject: string,
      @Body('text') text: string,
      ) {
      const user = await this.userService.findOne({where:{email:to}});
      if(!user){
          throw new BadRequestException("compte inexistant")
      }
      await this.userService.sendEmail(to, subject, text);
      return { message: 'Email envoyé avec succès' };
      }

      @Post('send_SMS')
      async sendSms(@Body() body: { phoneNumber: string; message: string }) {
          const { phoneNumber, message } = body;

          const user = await this.userService.findOne({where:{tele:phoneNumber}});
          if(!user){
              throw new BadRequestException("compte inexistant")
          }
          const result = await this.userService.sendSms(`+216 ${phoneNumber}`, message);
          return { message: 'Message envoyé avec succès', result};
      }     
}

export function createUserController(
  userService: UserService,
  jwtService: JwtService,
  mailService: MailerService
) {
  return new UserController(userService, jwtService, mailService);
}
  