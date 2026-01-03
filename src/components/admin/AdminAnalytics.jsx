import React, { useMemo } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
    LineChart, Line, ScatterChart, Scatter, ZAxis
} from 'recharts';

// ================= THEME CONSTANTS (MATCHING IMAGE) =================
const THEME = {
    bg: '#0f172a',        // Deep Blue Background
    card: '#1e293b',      // Navy Card Background
    textMain: '#f8fafc',  // White Text
    textSub: '#94a3b8',   // Slate Text
    grid: '#334155',      // Grid Lines
    tooltip: '#0f172a',   // Tooltip BG
};

// CHART PALETTES (Strictly Non-Random)
const ACCT_COLORS = ['#ef4444', '#f59e0b', '#f1f5f9']; // Red, Amber, White
const GENDER_COLORS = { Female: '#d97706', Male: '#d1d5db', Other: '#b91c1c' }; // Gold, Gray, Red
const LOAN_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#cbd5e1']; // Green (Appr), Amber (Closed), Red (Rej), Gray (Def)
const CHANNEL_COLORS = { Deposit: '#fcd34d', Withdrawal: '#ffffff', Transfer: '#3b82f6' }; // Gold, White, Blue
const RISK_COLORS = { High: '#ef4444', Medium: '#fcd34d', Low: '#60a5fa' }; // Red, Gold, Blue
const CARD_COLORS = { 'MasterCard': '#fff1f2', 'Visa': '#8b5cf6', 'AMEX': '#fef3c7', 'RuPay': '#f59e0b' }; // Varied

export default function AdminAnalytics({ data }) {

    // ================= DATA PROCESSING (STRICT / NO MOCK) =================
    const stats = useMemo(() => {
        // 1. Account Distribution
        const acctCounts = { Savings: 0, Current: 0, Joint: 0 };
        let totalAccts = 0;
        data.forEach(d => {
            const type = d.raw['Account Type']; // Access raw data
            if (acctCounts[type] !== undefined) {
                acctCounts[type]++;
                totalAccts++;
            }
        });
        const accountTypeData = Object.keys(acctCounts).map(name => ({
            name,
            value: acctCounts[name],
            percent: totalAccts ? ((acctCounts[name] / totalAccts) * 100).toFixed(1) : 0
        }));

        // 2. Loan Status by Gender
        const genderLoan = {};
        data.forEach(d => {
            const g = d.raw.Gender || 'Unknown';
            const s = d.raw['Loan Status'];
            if (s) {
                if (!genderLoan[g]) genderLoan[g] = { name: g, counts: {} };
                genderLoan[g].counts[s] = (genderLoan[g].counts[s] || 0) + 1;
            }
        });
        // Transform specifically for Bar Chart (Approved/Closed/Rejected/Default)
        const loanByGenderData = Object.values(genderLoan).map(item => ({
            name: item.name,
            Approved: item.counts['Approved'] || 0,
            Closed: item.counts['Closed'] || 0,
            Rejected: item.counts['Rejected'] || 0,
            Default: item.counts['Default'] || 0
        }));

        // 3. Loan Status Distribution (Pie)
        const loanStatus = {};
        data.forEach(d => {
            const s = d.raw['Loan Status'];
            if (s) loanStatus[s] = (loanStatus[s] || 0) + 1;
        });
        const loanStatusData = Object.keys(loanStatus).map(name => ({ name, value: loanStatus[name] }));

        // 4. Transaction Volume by Channel
        const channels = { Deposit: 0, Withdrawal: 0, Transfer: 0 };
        data.forEach(d => {
            const t = d.raw['Transaction Type'];
            if (channels[t] !== undefined) channels[t]++;
        });
        const channelData = Object.keys(channels).map(name => ({ name, count: channels[name] }));

        // 5. Transactions by Age (Scatter)
        const ageScatterData = data
            .filter(d => d.raw.Age && d.raw['Transaction Amount'])
            .map(d => ({
                x: d.raw.Age,
                y: d.raw['Transaction Amount'],
                z: 1 // size
            }))
            .slice(0, 150); // Limit points for performance

        // 6. Lending Trend (Monthly)
        const trendMap = {};
        data.forEach(d => {
            // Prioritize loan date, fallback to account opening if loan exists
            const dateStr = d.raw['Approval/Rejection Date'];
            if (d.raw['Loan Amount'] && dateStr) {
                const date = new Date(dateStr);
                if (!isNaN(date)) {
                    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    const label = date.toLocaleString('default', { month: 'short' }); // Jan, Feb
                    if (!trendMap[key]) trendMap[key] = { name: label, fullDate: key, amount: 0 };
                    trendMap[key].amount += d.raw['Loan Amount'];
                }
            }
        });
        const sampleTrend = Object.values(trendMap)
            .sort((a, b) => a.fullDate.localeCompare(b.fullDate));
        // Show full history or last 12 months. Let's show full sorted history.

        // 7. Risk Level
        const riskCounts = { High: 0, Medium: 0, Low: 0 };
        data.forEach(d => {
            const r = d.raw.RiskLevel;
            if (riskCounts[r] !== undefined) riskCounts[r]++;
        });
        const riskData = Object.keys(riskCounts).map(name => ({ name, value: riskCounts[name] }));

        // 8. Card Usage
        const cardCounts = {};
        data.forEach(d => {
            const c = d.raw['Card Type'];
            if (c) cardCounts[c] = (cardCounts[c] || 0) + 1;
        });
        const cardData = Object.keys(cardCounts).map(name => ({ name, count: cardCounts[name] }));

        return { accountTypeData, loanByGenderData, loanStatusData, channelData, ageScatterData, sampleTrend, riskData, cardData };
    }, [data]);

    // ================= STYLES =================
    const ContainerStyle = {
        background: THEME.bg,
        padding: '32px',
        borderRadius: '16px',
        color: THEME.textMain,
        fontFamily: '"Inter", sans-serif'
    };

    const CardStyle = {
        background: THEME.card,
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255,255,255,0.05)',
        height: '320px',
        display: 'flex',
        flexDirection: 'column'
    };

    const TitleStyle = {
        fontSize: '13px',
        fontWeight: '700',
        color: THEME.textSub,
        marginBottom: '16px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    };

    // Custom Toolkit for Dark Mode
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: THEME.tooltip, border: '1px solid #334155', padding: '8px 12px', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
                    <p style={{ color: '#fff', fontSize: '12px', fontWeight: '600' }}>{label}</p>
                    {payload.map((p, i) => (
                        <p key={i} style={{ color: p.color || '#fff', fontSize: '12px', margin: 0 }}>
                            {p.name}: {p.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div style={ContainerStyle}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#fdfefeff' }}>⚡ </span> <h4 style={{color:"white"}}>Analytics Intelligence</h4>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>

                {/* 1. ACCOUNTS (Donut) */}
                <div style={CardStyle}>
                    <h4 style={TitleStyle}>Count of Account Type</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.accountTypeData}
                                innerRadius={65}
                                outerRadius={85}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {stats.accountTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={ACCT_COLORS[index % ACCT_COLORS.length]} />
                                ))}
                            </Pie>
                            {/* Centered Percentage */}
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white" style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                {stats.accountTypeData[0]?.percent}%
                            </text>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend verticalAlign="right" align="right" layout="vertical" iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* 2. LOAN BY GENDER (Horizontal Bar) */}
                <div style={CardStyle}>
                    <h4 style={TitleStyle}>Count of Loan Status by Gender</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={stats.loanByGenderData} margin={{ left: 10 }}>
                            <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" stroke={THEME.textSub} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis dataKey="name" type="category" stroke={THEME.textSub} fontSize={12} width={60} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" />
                            <Bar dataKey="Approved" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="Closed" stackId="a" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="Rejected" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* 3. LOAN DIST (Pie) */}
                <div style={CardStyle}>
                    <h4 style={TitleStyle}>Loan Status Distribution</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.loanStatusData}
                                cx="50%"
                                cy="50%"
                                outerRadius={85}
                                dataKey="value"
                                stroke="none"
                            >
                                {stats.loanStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={LOAN_COLORS[index % LOAN_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* 4. TRANSACTION CHANNEL (Bar) */}
                <div style={CardStyle}>
                    <h4 style={TitleStyle}>Transaction Volume by Channel</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={stats.channelData} margin={{ left: 10 }}>
                            <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" stroke={THEME.textSub} fontSize={12} />
                            <YAxis dataKey="name" type="category" stroke={THEME.textSub} fontSize={12} width={80} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count">
                                {stats.channelData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[entry.name] || '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* 5. AGE SCATTER (Scatter) */}
                <div style={CardStyle}>
                    <h4 style={TitleStyle}>Count of Transaction By Age</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 10 }}>
                            <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="x" name="Age" unit=" yrs" stroke={THEME.textSub} fontSize={12} domain={[18, 80]} tickCount={8} />
                            <YAxis type="number" dataKey="y" name="Amount" unit="₹" stroke={THEME.textSub} fontSize={12} tickFormatter={(val) => `₹${val / 1000}k`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Scatter name="Transactions" data={stats.ageScatterData} fill="#8884d8">
                                {stats.ageScatterData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#f59e0b', '#ec4899', '#10b981'][index % 4]} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>

                {/* 6. DELINQUENCY TREND (Line) */}
                <div style={CardStyle}>
                    <h4 style={TitleStyle}>Loan Delinquency Trend</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.sampleTrend}>
                            <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" stroke={THEME.textSub} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke={THEME.textSub} fontSize={12} tickFormatter={(val) => `₹${val / 1000}k`} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#fff' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* 7. RISK LEVEL (Bar) */}
                <div style={CardStyle}>
                    <h4 style={TitleStyle}>Risk Level By Account ID</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.riskData}>
                            <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" stroke={THEME.textSub} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke={THEME.textSub} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                                {stats.riskData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name] || '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* 8. CARD USAGE (Bar) */}
                <div style={CardStyle}>
                    <h4 style={TitleStyle}>Count of Card Usage</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.cardData}>
                            <CartesianGrid stroke={THEME.grid} strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" stroke={THEME.textSub} fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke={THEME.textSub} fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {stats.cardData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={Object.values(CARD_COLORS)[index % 4]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
}
