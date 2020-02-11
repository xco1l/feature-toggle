import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

export interface IPermissions {
  [key: string]: {
    read: boolean;
    edit: boolean;
    delete: boolean;
    create: boolean;
  };
}

@Entity()
export class Permissions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('array')
  permissions: IPermissions[];

  @Column('varchar')
  role: string;
}
