import { MyContext } from '../types';
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver } from 'type-graphql';
import { User } from 'src/entities/User';



@InputType()
class UserPasswordInput {
    @Field()
    username: string;

    @Field()
    password: string;
}


@Resolver()
export class UserResolver {
   async register(
        @Arg('options') options: UserPasswordInput,
        @Ctx() {em}: MyContext
    ) {
        const user = em.create(User, {username: options.username});
        await em.persistAndFlush(user)
        return user
    }
}
