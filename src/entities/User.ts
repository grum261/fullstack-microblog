import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectType, Field, ID } from 'type-graphql'; 


@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryKey()
  id!: number;

  @Field(() => Date)
  @Property({type: 'date'})
  createdAt: Date = new Date();

  @Field(() => Date)
  @Property({type: 'date', onUpdate: () => new Date()})
  updatedAt: Date = new Date();

  @Field()
  @Property({unique: true})
  username!: string;

  @Field()
  @Property({nullable: true})
  email!: string;

  @Property()
  password!: string;
}
