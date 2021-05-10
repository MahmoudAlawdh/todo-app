import React from 'react';
import { ConfigProvider, Layout, Typography } from 'antd';
interface CustomLayoutProps {
	children: JSX.Element | JSX.Element[];
}
const CustomLayout = ({ children }: CustomLayoutProps) => {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Layout.Header>
				<Typography.Text style={{ color: 'white' }}>Todo-app</Typography.Text>
			</Layout.Header>
			<Layout.Content>{children}</Layout.Content>
			<Layout.Footer>Todo-app</Layout.Footer>
		</Layout>
	);
};

export default CustomLayout;
