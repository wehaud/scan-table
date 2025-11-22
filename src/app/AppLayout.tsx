import React from "react";
import { Layout } from "antd";

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          padding: "24px",
          margin: "0 auto",
          width: "100%"
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};
