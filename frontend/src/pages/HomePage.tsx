import { Card, Button, Typography, Space, Tag } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBook } from '@fortawesome/free-solid-svg-icons';

const { Title, Paragraph } = Typography;

/**
 * Example home page — illustrates the design system conventions:
 * - Card containers
 * - Button variants
 * - Tags for status
 * - Typography scale
 */
function HomePage() {
  return (
    <div style={{ padding: 10 }}>
      <Title level={4}>Welcome to your Devic Module</Title>
      <Paragraph type="secondary">
        This is the frontend scaffold. Replace with your module UI.
      </Paragraph>

      <Space direction="vertical" size={12} style={{ width: '100%', marginTop: 20 }}>
        <Card
          title="Getting Started"
          extra={
            <Button
              type="primary"
              size="small"
              icon={<FontAwesomeIcon icon={faPlus} />}
            >
              New Resource
            </Button>
          }
        >
          <Paragraph>
            Follow the module README to configure your service. The backend runs on
            port 3100 by default, and this frontend talks to it via the API base URL.
          </Paragraph>
          <Space>
            <Tag color="success">Active</Tag>
            <Tag color="blue">Dark mode</Tag>
            <Tag>v0.1.0</Tag>
          </Space>
        </Card>

        <Card
          title={
            <Space>
              <FontAwesomeIcon icon={faBook} />
              Documentation
            </Space>
          }
        >
          <Paragraph type="secondary">
            Check the frontend/README.md for the full design conventions guide.
          </Paragraph>
        </Card>
      </Space>
    </div>
  );
}

export default HomePage;
