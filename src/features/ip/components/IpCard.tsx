import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Space, Typography } from "antd";

const { Title, Text } = Typography;

export const IpCard = () => {
  const { ip } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
      <Card style={{ width: 400 }}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Button onClick={() => navigate(-1)}>Назад</Button>
          <Title level={4}>Карточка IP</Title>
          <Text strong>IP: {ip}</Text>
        </Space>
      </Card>
    </div>
  );
};
