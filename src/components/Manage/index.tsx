import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Form, Input, Modal, Select, Space, Table, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import MainLayout from '../CustomComponents/MainLayout';
import { accountService, Account, AccountPayload } from '../../services/accountService';
import { PlusOutlined } from '@ant-design/icons';

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
        title: <span className="text-slate-100 text-sm sm:text-base">Delete account</span>,
        content: (
          <span className="text-slate-300 text-sm sm:text-base">
            Are you sure you want to delete the account <strong className="text-slate-200">"{record.username}"</strong> on <strong className="text-slate-200">{record.service}</strong>?
          </span>
        ),
        okText: 'Delete',
        okButtonProps: { 
          danger: true,
          className: "!bg-red-500 hover:!bg-red-600 !border-red-500"
        },
        cancelButtonProps: {
          className: "!border-slate-600 !text-slate-300 hover:!border-slate-400 hover:!text-slate-100 !bg-slate-700/50"
        },
        className: "dark-modal",
        width: '90%',
        style: { maxWidth: '500px' },
        styles: {
          content: { 
            backgroundColor: '#1e293b', 
            border: '1px solid rgba(148, 163, 184, 0.2)',
            margin: '16px'
          },
          header: { 
            backgroundColor: '#1e293b', 
            borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
            padding: '16px'
          },
          footer: { 
            backgroundColor: '#1e293b', 
            borderTop: '1px solid rgba(148, 163, 184, 0.2)',
            padding: '12px 16px'
          },
          body: {
            padding: '16px'
          }
        },
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
        title: <span className="text-slate-200">Site</span>,
        dataIndex: 'service',
        key: 'service',
        render: (value: string) => <Text strong className="text-slate-200">{value}</Text>,
        width: 100,
      },
      {
        title: <span className="text-slate-200">Username</span>,
        dataIndex: 'username',
        key: 'username',
        render: (value: string) => <Text className="text-slate-300 break-all">{value}</Text>,
        responsive: ['sm'] as any,
        ellipsis: true,
        width: 120,
      },
      {
        title: <span className="text-slate-200">Password</span>,
        dataIndex: 'password',
        key: 'password',
        render: (value: string) => <Text className="text-slate-300 break-all font-mono text-xs">{value}</Text>,
        responsive: ['md'] as any,
        ellipsis: true,
        width: 120,
      },
      {
        title: <span className="text-slate-200">Balance</span>,
        dataIndex: 'balance',
        key: 'balance',
        align: 'right',
        render: (value?: number) => <Text className="text-slate-300 whitespace-nowrap">{numberFormatter(value)}</Text>,
        width: 100,
      },
      {
        title: <span className="text-slate-200">Available</span>,
        dataIndex: 'available',
        key: 'available',
        align: 'right',
        render: (value?: number) => <Text className="text-slate-300 whitespace-nowrap">{numberFormatter(value)}</Text>,
        responsive: ['sm'] as any,
        width: 100,
      },
      {
        title: <span className="text-slate-200">At Risk</span>,
        dataIndex: 'atrisk',
        key: 'atrisk',
        align: 'right',
        render: (value?: number) => <Text className="text-slate-300 whitespace-nowrap">{numberFormatter(value)}</Text>,
        responsive: ['md'] as any,
        width: 100,
      },
      {
        title: <span className="text-slate-200">Actions</span>,
        key: 'actions',
        fixed: 'right' as const,
        width: 100,
        render: (_, record) => (
          <Space size="small" direction="vertical" className="sm:!flex-row sm:!space-x-2">
            <Button 
              type="link" 
              onClick={() => handleEditAccount(record)}
              className="!text-emerald-400 hover:!text-emerald-300 !p-0 !h-auto"
              size="small"
            >
              Edit
            </Button>
            <Button 
              type="link" 
              danger 
              onClick={() => handleDeleteAccount(record)}
              className="!text-red-400 hover:!text-red-300 !p-0 !h-auto"
              size="small"
            >
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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <Card
            title={
              <span className="text-slate-100 font-semibold text-base sm:text-lg">
                Account Management
              </span>
            }
            extra={
              <div className="flex items-center">
                <Tooltip title="Add Account">
                  <Button 
                    type="primary" 
                    onClick={handleAddAccount} 
                    icon={<PlusOutlined />} 
                    size="small"
                    className="sm:!text-base !bg-emerald-500 hover:!bg-emerald-600 !border-emerald-500"
                  >
                  </Button>
                </Tooltip>
              </div>
            }
            className="!bg-slate-800/50 !border-slate-700/50 backdrop-blur-sm shadow-xl"
            headStyle={{ 
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)', 
              background: 'transparent',
              padding: '12px 16px'
            }}
            bodyStyle={{ 
              background: 'transparent',
              padding: '12px 8px sm:16px'
            }}
          >
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <Table
                rowKey="id"
                columns={columns}
                dataSource={accounts}
                loading={loading}
                pagination={{ 
                  pageSize: 10, 
                  showSizeChanger: true,
                  className: 'dark-pagination',
                  showTotal: (total) => `Total ${total} accounts`,
                  responsive: true,
                  pageSizeOptions: ['5', '10', '20', '50'],
                }}
                className="dark-table"
                scroll={{ x: 'max-content' }}
                size="small"
              />
            </div>
          </Card>
        </div>
      </div>

      <Modal
        destroyOnClose
        open={modalOpen}
        title={
          <span className="text-slate-100 font-semibold text-base sm:text-lg">
            {editingAccount ? 'Edit Account' : 'Add Account'}
          </span>
        }
        okText={editingAccount ? 'Save Changes' : 'Create Account'}
        onCancel={handleModalCancel}
        onOk={() => form.submit()}
        confirmLoading={saving}
        className="dark-modal"
        width="90%"
        style={{ maxWidth: '600px' }}
        okButtonProps={{
          className: "!bg-emerald-500 hover:!bg-emerald-600 !border-emerald-500"
        }}
        cancelButtonProps={{
          className: "!border-slate-600 !text-slate-300 hover:!border-slate-400 hover:!text-slate-100 !bg-slate-700/50"
        }}
        styles={{
          content: { 
            backgroundColor: '#1e293b', 
            border: '1px solid rgba(148, 163, 184, 0.2)',
            margin: '16px'
          },
          header: { 
            backgroundColor: '#1e293b', 
            borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
            padding: '16px'
          },
          footer: { 
            backgroundColor: '#1e293b', 
            borderTop: '1px solid rgba(148, 163, 184, 0.2)',
            padding: '12px 16px'
          },
          body: {
            padding: '16px'
          }
        }}
      >
        <Form<AccountPayload>
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          className="responsive-form"
        >
          <Form.Item
            name="service"
            label={<span className="text-slate-200 text-sm sm:text-base">Site</span>}
            rules={[{ required: true, message: 'Site is required' }]}
            className="!mb-3 sm:!mb-4"
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
              className="dark-select w-full"
              size="large"
              style={{
                backgroundColor: '#334155',
                borderColor: '#475569',
                color: '#e2e8f0'
              }}
            />
          </Form.Item>

          <Form.Item
            name="username"
            label={<span className="text-slate-200 text-sm sm:text-base">Username</span>}
            rules={[{ required: true, message: 'Username is required' }]}
            className="!mb-3 sm:!mb-4"
          >
            <Input 
              disabled={editingAccount ? true : false} 
              placeholder="Enter username"
              className="dark-input w-full"
              size="large"
              style={{
                backgroundColor: '#334155',
                borderColor: '#475569',
                color: '#e2e8f0'
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="text-slate-200 text-sm sm:text-base">Password</span>}
            rules={[{ required: true, message: 'Password is required' }]}
            className="!mb-3 sm:!mb-4"
          >
            <Input 
              placeholder="Enter password"
              className="dark-input w-full"
              size="large"
              style={{
                backgroundColor: '#334155',
                borderColor: '#475569',
                color: '#e2e8f0'
              }}
            />
          </Form.Item>

          <Form.Item
            name="playerId"
            label={<span className="text-slate-200 text-sm sm:text-base">Player Id</span>}
            className="!mb-3 sm:!mb-4"
          >
            <Input 
              placeholder="Enter player id"
              className="dark-input w-full"
              size="large"
              style={{
                backgroundColor: '#334155',
                borderColor: '#475569',
                color: '#e2e8f0'
              }}
            />
          </Form.Item>

          <Form.Item
            name="profileId"
            label={<span className="text-slate-200 text-sm sm:text-base">Profile Id</span>}
            className="!mb-3 sm:!mb-4"
          >
            <Input 
              placeholder="Enter profile id"
              className="dark-input w-full"
              size="large"
              style={{
                backgroundColor: '#334155',
                borderColor: '#475569',
                color: '#e2e8f0'
              }}
            />
          </Form.Item>

          <Form.Item
            name="profileLimitId"
            label={<span className="text-slate-200 text-sm sm:text-base">Profile Limit Id</span>}
            className="!mb-0"
          >
            <Input 
              placeholder="Enter profile limit id"
              className="dark-input w-full"
              size="large"
              style={{
                backgroundColor: '#334155',
                borderColor: '#475569',
                color: '#e2e8f0'
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
};

export default Manage;

