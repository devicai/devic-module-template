import { Card, Form, Input, Button, Switch, Typography, Space } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * Example settings page — illustrates form patterns.
 */
function SettingsPage() {
  return (
    <div style={{ padding: 10 }}>
      <Title level={4}>Settings</Title>
      <Paragraph type="secondary">Configure your module preferences.</Paragraph>

      <Card style={{ marginTop: 20, maxWidth: 600 }}>
        <Form layout="vertical">
          <Form.Item label="Module Name" name="name">
            <Input placeholder="my-module" />
          </Form.Item>

          <Form.Item label="API Base URL" name="apiUrl">
            <Input placeholder="http://localhost:3100/api/v1" />
          </Form.Item>

          <Form.Item label="Enable notifications" name="notifications" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Space>
            <Button type="primary">Save</Button>
            <Button>Cancel</Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}

export default SettingsPage;
