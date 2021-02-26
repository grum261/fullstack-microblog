import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import microConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { NuPrivetResolver } from './resolvers/privet';
import { PostResolver } from './resolvers/posts';


const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [NuPrivetResolver, PostResolver],
            validate: false
        }),
        context: () => ({ em: orm.em }),
    });

    apolloServer.applyMiddleware({ app });

    app.listen(8000, () => {
        console.log('Listening on localhost:8000')
    })
};

main().catch((err) => {
    console.error(err);
});
