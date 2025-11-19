import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Modal, Select, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import MainLayout from '../CustomComponents/MainLayout';
import { accountService, Account, AccountPayload } from '../../services/accountService';

const { Text } = Typography;

const SITE_OPTIONS = [
  'Action',
  'Godds',
  'Highroller',
  'Fesster',
  'Betwindycity',
  'Abcwager',
  'Strikerich',
];

const numberFormatter = (value?: number) => {
  if (value === null || value === undefined) {
    return '-';
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(2) : '-';
};

const Manage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [form] = Form.useForm<AccountPayload>();

  const siteOptions = useMemo(() => {
    const unique = new Set<string>(SITE_OPTIONS);
    accounts.forEach((account) => {
      if (account.service) {
        unique.add(account.service);
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [accounts]);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await accountService.list();
      setAccounts(data);
    } catch (error) {
      console.error(error);
      window.SM?.error?.(
        typeof error === 'string' ? error : 'Failed to load accounts'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleAddAccount = useCallback(() => {
    setEditingAccount(null);
    form.resetFields();
    form.setFieldsValue({
      service: siteOptions[0] ?? SITE_OPTIONS[0],
      balance: 0,
      available: 0,
      atrisk: 0,
    });
    setModalOpen(true);
  }, [form, siteOptions]);

  const handleEditAccount = useCallback(
    (record: Account) => {
      setEditingAccount(record);
      form.setFieldsValue({
        service: record.service,
        username: record.username,
        password: record.password,
        playerId: record.playerId,
        profileId: record.profileId,
        profileLimitId: record.profileLimitId,
        balance: record.balance,
        available: record.available,
        atrisk: record.atrisk,
        sessionId: record.sessionId ?? '',
      });
      setModalOpen(true);
    },
    [form]
  );

  const handleDeleteAccount = useCallback(
    (record: Account) => {
      Modal.confirm({
        title: 'Delete account',
        content: `Are you sure you want to delete the account "${record.username}" on ${record.service}?`,
        okText: 'Delete',
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            await accountService.remove(record.id, {
              service: record.service,
              username: record.username,
              password: record.password,
              playerId: record.playerId,
              profileId: record.profileId,
              profileLimitId: record.profileLimitId,
            });
            window.SM?.success?.('Account deleted');
            await loadAccounts();
          } catch (error) {
            console.error(error);
            window.SM?.error?.(
              typeof error === 'string' ? error : 'Failed to delete account'
            );
          }
        },
      });
    },
    [loadAccounts]
  );

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    try {
      const refreshed = await accountService.refresh();
      if (refreshed.length > 0) {
        setAccounts(refreshed);
      } else {
        await loadAccounts();
      }
      window.SM?.success?.('Accounts refreshed');
    } catch (error) {
      console.error(error);
      window.SM?.error?.(
        typeof error === 'string' ? error : 'Failed to refresh accounts'
      );
    } finally {
      setLoading(false);
    }
  }, [loadAccounts]);

  const handleModalCancel = useCallback(() => {
    setModalOpen(false);
    setEditingAccount(null);
    form.resetFields();
  }, [form]);

  const handleSubmit = useCallback(
    async (values: AccountPayload) => {
      setSaving(true);
      const payload: Omit<AccountPayload, 'balance' | 'available' | 'atrisk'> = {
        service: values.service,
        username: (values.username ?? '').trim(),
        password: (values.password ?? '').trim(),
        playerId: (values.playerId ?? '').trim(),
        profileId: (values.profileId ?? '').trim(),
        profileLimitId: (values.profileLimitId ?? '').trim(),
      };

      try {
        if (editingAccount) {
          await accountService.update(editingAccount.id, payload);
          window.SM?.success?.('Account updated');
        } else {
          await accountService.create(payload);
          window.SM?.success?.('Account created');
        }
        setModalOpen(false);
        setEditingAccount(null);
        form.resetFields();
        await loadAccounts();
      } catch (error) {
        console.error(error);
        window.SM?.error?.(
          typeof error === 'string' ? error : 'Failed to save account'
        );
      } finally {
        setSaving(false);
      }
    },
    [editingAccount, form, loadAccounts]
  );

  const columns: ColumnsType<Account> = useMemo(
    () => [
      {
        title: 'Site',
        dataIndex: 'service',
        key: 'service',
        render: (value: string) => <Text strong>{value}</Text>,
      },
      {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: 'Password',
        dataIndex: 'password',
        key: 'password',
      },
      {
        title: 'Player Id',
        dataIndex: 'playerId',
        key: 'playerId',
      },
      {
        title: 'Profile Id',
        dataIndex: 'profileId',
        key: 'profileId',
      },
      {
        title: 'Profile Limit Id',
        dataIndex: 'profileLimitId',
        key: 'profileLimitId',
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
        align: 'right',
        render: (value?: number) => numberFormatter(value),
      },
      {
        title: 'Available',
        dataIndex: 'available',
        key: 'available',
        align: 'right',
        render: (value?: number) => numberFormatter(value),
      },
      {
        title: 'At Risk',
        dataIndex: 'atrisk',
        key: 'atrisk',
        align: 'right',
        render: (value?: number) => numberFormatter(value),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <Space size="middle">
            <Button type="link" onClick={() => handleEditAccount(record)}>
              Edit
            </Button>
            <Button type="link" danger onClick={() => handleDeleteAccount(record)}>
              Delete
            </Button>
          </Space>
        ),
      },
    ],
    [handleDeleteAccount, handleEditAccount]
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card
          title="Account Management"
          extra={
            <Space>
              <Button type="primary" onClick={handleAddAccount}>
                Add Account
              </Button>
            </Space>
          }
        >
          <Table
            rowKey="id"
            columns={columns}
            dataSource={accounts}
            loading={loading}
            pagination={{ pageSize: 10, showSizeChanger: true }}
          />
        </Card>
      </div>

      <Modal
        destroyOnClose
        open={modalOpen}
        title={editingAccount ? 'Edit Account' : 'Add Account'}
        okText={editingAccount ? 'Save Changes' : 'Create Account'}
        onCancel={handleModalCancel}
        onOk={() => form.submit()}
        confirmLoading={saving}
      >
        <Form<AccountPayload>
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="service"
            label="Site"
            rules={[{ required: true, message: 'Site is required' }]}
          >
            <Select
              options={siteOptions.map((service) => ({
                label: service,
                value: service,
              }))}
              disabled={editingAccount ? true : false} 
              showSearch
              optionFilterProp="label"
              placeholder="Select service"
            />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Username is required' }]}
          >
            <Input disabled={editingAccount ? true : false} placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            name="playerId"
            label="Player Id"
          >
            <Input placeholder="Enter player id" />
          </Form.Item>

          <Form.Item
            name="profileId"
            label="Profile Id"
          >
            <Input placeholder="Enter profile id" />
          </Form.Item>

          <Form.Item
            name="profileLimitId"
            label="Profile Limit Id"
          >
            <Input placeholder="Enter profile limit id" />
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default Manage;

