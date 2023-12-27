import { Exclude } from 'class-transformer';
import {
  AfterInsert,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with user id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with user id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed user with user id', this.id);
  }
}
