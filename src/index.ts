import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import microConfig from './mikro-orm.config';


const main = async () => {
    const orm = await MikroORM.init(microConfig);

    await orm.em.nativeInsert(Post, {title: 'first post'});
};

main().catch((err) => {
    console.error(err);
});