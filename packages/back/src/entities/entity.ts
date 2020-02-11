import {
  Entity as E,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum EntityType {
  TOGGLE = 'toggle',
  GROUP = 'group',
  PROJECT = 'project',
  ROOT = 'root',
}

export interface Entity extends Object {
  id: string;
  state: boolean;
  path: string;
  name: string;
  description: string;
  created_at: Date;
  lastCall: Date;
  type: EntityType;
  owner: string;
  parentId: string;
}

@E()
export class Entity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('boolean', {nullable: true})
  state: boolean;

  @Column('varchar')
  path: string;

  @Column('varchar', {nullable: false})
  name: string;

  @Column('text', {nullable: false, default: ''})
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @Column('timestamp', {nullable: true})
  lastCall: Date;

  @Column('enum', {nullable: false, enum: EntityType})
  type: EntityType;

  @Column('varchar', {nullable: false})
  owner: string;

  @Column('varchar', {nullable: true})
  parentId: string;
}
