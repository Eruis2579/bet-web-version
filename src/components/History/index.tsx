import { useState, useEffect } from 'react'
import {
  Table,
  Tag,
  Card,
  Button,
  Statistic,
  Row,
  Col,
  Typography,
} from 'antd'
import {
  ReloadOutlined,
  TrophyOutlined,
  DollarOutlined,
  PercentageOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import MainLayout from '../CustomComponents/MainLayout'
import { useAuth } from '../../contexts/AuthContext'
import { getHistory } from '../../services/betService'
import { ColumnsType } from 'antd/es/table'

const { Title } = Typography

const BettingHistory = () => {
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState({
    current: 1,
    pageSize: 10
  })
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const { user } = useAuth()

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getBookName = (bookid: string, data: any) => {
    const book = data.find((item: any) => item.key === bookid)
    return book?.title
  }
  const getProposition = (item: any) => {

    if (item.proposition === "h2h") {
      // Show just the team name for head-to-head
      return item.position;
    } else if (item.proposition === "spreads") {
      // Show home vs away with spread
      return item.odds
        ? `${item.position} ${item.line}`
        : "";
    } else if (item.proposition === "totals") {
      // Show home vs away with total
      return item.odds
        ? `${item.position} ${item.line}`
        : "";
    }

    return "";
  };

  const getOdds = (item: any) => {
    const book = item?.odds?.bookmakers.filter((v: any) => v.key === item.bookId)
    if(!book.length) return 0
    const markets = book[0]?.markets?.filter((v: any) => v.key === item.proposition)
    const outcome = markets[0]?.outcomes?.filter((v: any) => v.name === item.position)
    return outcome[0]?.price

  }

  const getHistoryData = (current: number, pageSize: number) => {
    setLoading(true)
    getHistory(current, pageSize)
      .then((response) => {
        const datas: any = [];
        setTotal(response?.total)
        response?.list.forEach((item: any) => {
          datas.push({
            id: item._id,
            bookmaker: getBookName(item.bookId, item?.odds?.bookmakers),
            league: item?.odds?.sport_title,
            match: item?.odds?.home_team + " vs " + item?.odds?.away_team,
            market: item?.proposition === "h2h" ? "Moneyline" : (item?.proposition === "spreads" ? "Spread" : "Total"),
            proposition: getProposition(item),
            odds: getOdds(item),
            stake: item.stake,
            profit: item.status === 'pending' ? '-' : item.netProfit,
            status: item.status === 'pending' ? 'pending' : (item.outcome === 'Win' ? 'won' : 'lost'),
            placedAt: item.placedAt,
            commenceAt: item.odds.commence_time
          })
        })
        setBets(datas)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    getHistoryData(page.current, page.pageSize);
  }, [page])
  // Mock data - replace with actual API call
  const getStatusColor = (status: any) => {
    switch (status) {
      case 'won': return 'success'
      case 'lost': return 'error'
      case 'pending': return 'processing'
      // case 'void': return 'default'
      default: return 'default'
    }
  }

  const getOddsDisplay = (odds: any) => {
    return odds > 0 ? `+${odds}` : `${odds}`
  }

  const getProfitDisplay = (profit: any, status: any) => {
    if (status === 'pending') return '-'
    if (profit > 0) return `+$${profit.toFixed(2)}`
    if (profit < 0) return `-$${Math.abs(profit).toFixed(2)}`
    return '$0.00'
  }

  const getProfitColor = (profit: any, status: any) => {
    if (status === 'pending') return '#a0a6b8'
    if (profit > 0) return '#00ff88'
    if (profit < 0) return '#ff4d4f'
    return '#a0a6b8'
  }

  const columns: ColumnsType<any> = [
    {
      title: 'No',
      key: 'no',
      width: 80,
      align: 'center',
      render: (_: any, __: any, c: any) => (
        <span>{c + 1}</span>
      )
    },
    {
      title: 'Bookmaker',
      dataIndex: 'bookmaker',
      key: 'bookmaker',
      width: 100,
      align: 'center',
      render: (text: any) => (
        <Tag color="blue" style={{ margin: 0 }}>{text}</Tag>
      )
    },
    {
      title: 'League',
      dataIndex: 'league',
      key: 'league',
      width: 120,
      align: 'center',
      render: (text: any) => (
        <Tag color="orange" style={{ margin: 0 }}>{text}</Tag>
      )
    },
    {
      title: 'Match',
      dataIndex: 'match',
      key: 'match',
      width: 180,
      align: 'center',
      render: (text: any) => (
        <div style={{ fontSize: '13px', lineHeight: '1.4' }}>{text}</div>
      )
    },
    {
      title: 'Market',
      dataIndex: 'market',
      key: 'market',
      width: 80,
      align: 'center',
      render: (text: any) => (
        <Tag color="purple" style={{ margin: 0 }}>{text}</Tag>
      )
    },
    {
      title: 'Proposition',
      dataIndex: 'proposition',
      key: 'proposition',
      width: 150,
      align: 'center',
      render: (text: any) => (
        <div style={{ fontSize: '13px', fontWeight: '500' }}>{text}</div>
      )
    },
    {
      title: 'Odds',
      dataIndex: 'odds',
      key: 'odds',
      width: 70,
      align: 'center',
      render: (odds: any) => (
        <span style={{
          fontFamily: 'monospace',
          fontWeight: '600',
          color: odds > 0 ? '#00ff88' : '#ffffff'
        }}>
          {odds ? getOddsDisplay(odds) : "-"}
        </span>
      )
    },
    {
      title: 'Stake',
      dataIndex: 'stake',
      key: 'stake',
      width: 80,
      align: 'center',
      render: (stake: any) => (
        <span style={{ fontFamily: 'monospace' }}>${stake.toFixed(2)}</span>
      )
    },
    {
      title: 'Profit/Loss',
      dataIndex: 'profit',
      key: 'profit',
      width: 100,
      align: 'center',
      render: (profit: any, record: any) => (
        <span style={{
          fontFamily: 'monospace',
          fontWeight: '600',
          color: getProfitColor(profit, record.status)
        }}>
          {getProfitDisplay(profit, record.status)}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      align: 'center',
      render: (status: any) => (
        <Tag color={getStatusColor(status)} style={{ margin: 0, textTransform: 'capitalize' }}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Placed',
      dataIndex: 'placedAt',
      key: 'placedAt',
      width: 120,
      align: 'center',
      render: (date: any) => (
        <div style={{ fontSize: '12px' }}>
          <div>{dayjs(date).format('MMM DD, YYYY')}</div>
          <div style={{ color: '#a0a6b8' }}>{dayjs(date).format('HH:mm')}</div>
        </div>
      )
    },
    {
      title: 'Game Time',
      dataIndex: 'commenceAt',
      key: 'commenceAt',
      width: 120,
      align: 'center',
      render: (date: any) => (
        <div style={{ fontSize: '12px' }}>
          <div>{dayjs(date).format('MMM DD, YYYY')}</div>
          <div style={{ color: '#a0a6b8' }}>{dayjs(date).format('HH:mm')}</div>
        </div>
      )
      // },
      // {
      //   title: 'Control',
      //   key: 'control',
      //   width: 80,
      //   align:'center',
      //   fixed: 'right',
      //   render: (_: any, record: any) => (
      //     record.status === 'pending' && (
      //       <Button 
      //         type="text"
      //         icon={<DeleteOutlined />}
      //         onClick={() => cancelBet(record._id)}
      //         className="text-red-400 hover:text-red-300"
      //       />
      //     )
      //   )
    }
  ]

  return (
    <>
      <MainLayout>
        <div style={{
          padding: isMobile ? '16px' : '24px',
          background: '#1a1d29',
          minHeight: 'calc(100vh - 64px)'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <Title level={isMobile ? 3 : 2} style={{ color: '#ffffff', margin: 0 }}>
              Betting History
            </Title>
            <p style={{
              color: '#a0a6b8',
              marginTop: '8px',
              fontSize: isMobile ? '13px' : '14px'
            }}>
              Track your betting performance and analyze your results
            </p>
          </div>

          {/* Statistics Cards */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Card style={{ background: '#1e2332', border: '1px solid #2a2f3f' }} className="stats-card">
                <Statistic
                  title={<span style={{ color: '#a0a6b8' }}>Total Bets</span>}
                  value={user?.totalBets}
                  prefix={<TrophyOutlined style={{ color: '#1890ff' }} />}
                  valueStyle={{ color: '#ffffff' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Card style={{ background: '#1e2332', border: '1px solid #2a2f3f' }} className="stats-card">
                <Statistic
                  title={<span style={{ color: '#a0a6b8' }}>Total Stake</span>}
                  value={user?.totalStake}
                  prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
                  precision={2}
                  valueStyle={{ color: '#ffffff' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Card style={{ background: '#1e2332', border: '1px solid #2a2f3f' }} className="stats-card">
                <Statistic
                  title={<span style={{ color: '#a0a6b8' }}>Total P&L</span>}
                  value={user?.totalProfit}
                  prefix={<DollarOutlined style={{ color: (user?.totalProfit ?? 0) >= 0 ? '#00ff88' : '#ff4d4f' }} />}
                  precision={2}
                  valueStyle={{ color: (user?.totalProfit ?? 0) >= 0 ? '#00ff88' : '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Card style={{ background: '#1e2332', border: '1px solid #2a2f3f' }} className="stats-card">
                <Statistic
                  title={<span style={{ color: '#a0a6b8' }}>Win Rate</span>}
                  value={user?.winRate}
                  prefix={<PercentageOutlined style={{ color: '#1890ff' }} />}
                  precision={1}
                  suffix="%"
                  valueStyle={{ color: '#ffffff' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Filters */}
          <Card style={{ background: '#1e2332', border: '1px solid #2a2f3f', marginBottom: '24px' }}>

            <Row gutter={16} align="middle" justify="space-between">
              <Title level={isMobile ? 4 : 3} style={{ color: '#ffffff', margin: 0 }}>
                Betting List
              </Title>
              <Col xl={2} lg={2} md={4}>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => getHistoryData(page.current, page.pageSize)}
                  style={{ width: '100%' }}
                >
                  Refresh
                </Button>
              </Col>
            </Row>
          </Card>

          {/* Betting History Table */}
          <Card style={{ background: '#1e2332', border: '1px solid #2a2f3f' }}>
            <Table
              columns={columns}
              dataSource={bets}
              loading={loading}
              rowKey="id"
              pagination={{
                total: total,
                pageSize: page.pageSize,
                current: page.current,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange(page, pageSize) {
                  setPage({
                    current: page,
                    pageSize: pageSize
                  })
                },
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} bets`,
                style: { marginTop: '16px' },
                responsive: true
              }}
              scroll={{ x: 1200 }}
              size={isMobile ? "small" : "middle"}
            />
          </Card>
        </div>
      </MainLayout>
    </>
  )
}

export default BettingHistory