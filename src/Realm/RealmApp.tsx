import { createContext, useRef, useState, useEffect, useContext } from 'react';
import { App, Credentials, User } from 'realm-web';

const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
if (!REALM_APP_ID) {
	throw new Error(
		'ADD NEXT_PUBLIC_REALM_APP_ID to env variable ".env.local" for more information visit https://nextjs.org/docs/basic-features/environment-variables'
	);
}
const app = new App({ id: REALM_APP_ID });

const RealmAppContext = createContext<IRealmApp | void>(undefined);

interface IRealmApp {
	id: string;
	user: Realm.User | null;
	anonymouslogIn: () => Promise<void>;
	logOut: () => Promise<void>;
}

const RealmApp: React.FC = ({ children }: any) => {
	// Keep track of the current user in local state
	const appRef = useRef(app);
	const [user, setUser] = useState<User | null>(app.currentUser);
	useEffect(() => {
		if (app.currentUser === null) {
			anonymouslogIn();
		}
		setUser(app.currentUser);
	}, [appRef.current.currentUser]);

	const anonymouslogIn = async () => {
		const credentials = Credentials.anonymous();
		await app.logIn(credentials);
		setUser(app.currentUser);
	};

	// Let logged in users log out
	const logOut = async () => {
		if (app.currentUser) {
			await localStorage.clear();
			await sessionStorage.clear();
			await app.currentUser.logOut();
		}
		setUser(app.currentUser);
	};

	// Provide the current user and authentication methods to the wrapped tree
	const context: IRealmApp = {
		id: REALM_APP_ID,
		user,
		logOut,
		anonymouslogIn,
	};

	return <RealmAppContext.Provider value={context}>{children}</RealmAppContext.Provider>;
};
export default RealmApp;

export const useRealmApp = (): IRealmApp => {
	const app = useContext(RealmAppContext);

	if (!app) {
		throw new Error('You must call useRealmApp() inside of a <RealmApp />.');
	}
	return app;
};
