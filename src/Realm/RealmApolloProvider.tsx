import { useEffect, useState } from 'react';
import * as Realm from 'realm-web';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';

import { useRealmApp } from './RealmApp';

const RealmApolloProvider = (props: any) => {
	const { id, user } = useRealmApp();
	let cache: any = new InMemoryCache();
	const [state, setstate] = useState<any>(createApolloClient(id, user as Realm.User, cache));
	useEffect(() => {
		setstate(createApolloClient(id, user as Realm.User, cache));
	}, [user]);
	return <ApolloProvider client={state}>{props.children}</ApolloProvider>;
};

export default RealmApolloProvider;
function createApolloClient(realmAppId: string, user: Realm.User, cache: InMemoryCache) {
	const graphql_url = `https://realm.mongodb.com/api/client/v2.0/app/${realmAppId}/graphql`;
	const httpLink = new HttpLink({
		uri: graphql_url,
		fetch: async (uri: any, options: any) => {
			const accessToken = user.accessToken;
			options.headers.Authorization = `Bearer ${accessToken}`;
			let data = await fetch(uri, options);
			if (data.status !== 200) {
				await user.refreshAccessToken();
				options.headers.Authorization = `Bearer ${user.accessToken}`;
				data = await fetch(uri, options);
			}
			return data;
		},
	});
	return new ApolloClient({
		ssrMode: true,
		link: httpLink,
		cache: cache,
	});
}
