import { Column, Entity,  PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    user_id:number;

    @Column({default:''})
    nom?:string;

    @Column({default:''})
    prenom?:string;

    @Column({default:0})
    tele?:number;

    @Column()
    email:string;

    @Column({default:''})
    password?:string;

    @Column({default:"client"})
    role?:string;   
    @Column({type:'timestamp',default:()=>'CURRENT_TIMESTAMP'})
    createdAt?:Date;

}