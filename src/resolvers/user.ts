import { MyContext } from '../types';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from 'type-graphql';
import { User } from '../entities/User';
import argon2 from 'argon2';


@InputType()
class UsernameEmailPasswordInput {
    @Field()
    username: string;

    @Field({nullable: true, defaultValue: ''})
    email: string;

    @Field()
    password: string;
}


@ObjectType()
class FieldError {
    @Field()
    field: string;

    @Field()
    message: string;
}


@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => User, {nullable: true})
    user?: User;
}


@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernameEmailPasswordInput,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse> {
        const hashedPassword = await argon2.hash(options.password);
        if (
            await em.findOne(User, {username: options.username}) &&
            options.email !== ''  && await em.findOne(User, {email: options.email})
        ) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'user with this username already exists',
                    },
                    {
                        field: 'email',
                        message: 'user with this email already exists',
                    }
                ]
            }
        }
        if (await em.findOne(User, {username: options.username})) {
            return {
                errors: [{
                    field: 'username',
                    message: 'user with this username already exists',
                }]
            }
        }
        if (options.email !== ''  && await em.findOne(User, {email: options.email})) {
            return {
                errors: [{
                    field: 'email',
                    message: 'user with this email already exists',
                }]
            }
        }
        const user = em.create(User, {
            username: options.username,
            email: options.email,
            password: hashedPassword,
        });
        await em.persistAndFlush(user);
        return {user};
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernameEmailPasswordInput,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, {username: options.username})
        if (!user) {
            return {
                errors: [{
                    field: 'username',
                    message: 'username doesnt exist'
                }]
            };
        }
        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [{
                    field: 'password',
                    message: 'incorrect password',
                },]
            };
        }
        return {user};
    } 
}
