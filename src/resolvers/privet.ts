import { Query, Resolver } from 'type-graphql';


@Resolver()
export class NuPrivetResolver {
    @Query(() => String)
    urod() {
        return 'nu privet, urod'
    }
}