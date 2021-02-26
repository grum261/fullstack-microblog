import { Post } from '../entities/Post';
import { MyContext } from '../types';
import { Arg, Ctx, ID, Mutation, Query, Resolver } from 'type-graphql';


@Resolver()
export class PostResolver {
    @Query(() => [Post])
    async posts(@Ctx() {em}: MyContext): Promise<Post[]> {
        return await em.find(Post, {});
    }

    @Query(() => Post, {nullable: true})
    async post(
        @Arg('id') id: number, 
        @Ctx() {em}: MyContext
    ): Promise<Post | null> {
        return await em.findOne(Post, {id});
    }

    @Mutation(() => Post)
    async createPost(
        @Arg('title') title: string, 
        @Ctx() {em}: MyContext
    ): Promise<Post> {
        const post = em.create(Post, {title});
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg('id') id: number,
        @Arg('title', () => String, {nullable: true}) title: string, 
        @Ctx() {em}: MyContext
    ): Promise<Post | null> {
        const post = await em.findOne(Post, {id});
        if (!post) {
            return null;
        }
        if (typeof title !== undefined) {
            post.title = title;
            await em.persistAndFlush(post);
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') id: number, 
        @Ctx() {em}: MyContext
    ): Promise<boolean> {
        // Почитать про try catch, чтобы возвращать false при несуществующем id
        if (await em.findOne(Post, {id}) === null) {
            return false;
        }
        await em.nativeDelete(Post, {id});
        return true;
    }
}