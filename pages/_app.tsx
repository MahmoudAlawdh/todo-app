import '../styles/globals.css';
import { useEffect } from 'react';
import CustomLayout from '../src/layout/CustomLayout';
import RealmApolloProvider from '../src/Realm/RealmApolloProvider';
import RealmApp, { useRealmApp } from '../src/Realm/RealmApp';

const RequireLoggedInUser = ({ children }) => {
	const { user, anonymouslogIn } = useRealmApp();
	useEffect(() => {
		if (!user) {
			anonymouslogIn();
		}
	}, [user]);
	return children;
};
function MyApp({ Component, pageProps }) {
	return (
		<RealmApp>
			<RealmApolloProvider>
				<CustomLayout>
					<RequireLoggedInUser>
						<Component {...pageProps} />
					</RequireLoggedInUser>
				</CustomLayout>
			</RealmApolloProvider>
		</RealmApp>
	);
}

export default MyApp;
