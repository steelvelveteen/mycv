import { Report } from 'src/reports/report.entity';
import {
  AfterInsert,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';

/**
 *  User entity typeorm
 *
 * @property id number
 * @property email string
 * @property password string
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isAdmin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

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
