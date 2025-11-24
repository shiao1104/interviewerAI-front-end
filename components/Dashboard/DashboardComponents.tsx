import React from 'react';
import { Box, Paper, Typography, Chip, Avatar, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

// --- Types ---
interface KPICardProps {
    title: string;
    value: string | number;
    trend?: string;
    trendType?: 'up' | 'down' | 'neutral';
    icon?: React.ReactNode;
    color?: string;
}

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
    height?: number;
    action?: React.ReactNode;
}

interface CandidateCardProps {
    name: string;
    score: number;
    type: 'On-site' | 'Online';
    tags: string[];
    status: string;
    avatarUrl?: string;
    onClick?: () => void;
}

// --- Components ---

export const KPICard: React.FC<KPICardProps> = ({ title, value, trend, trendType = 'neutral', icon, color = '#1976d2' }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(0,0,0,0.02)',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.08)',
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#2D3748' }}>
                        {value}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        backgroundColor: `${color}15`,
                        p: 1.5,
                        borderRadius: '12px',
                        color: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {icon}
                </Box>
            </Box>

            {trend && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {trendType === 'up' && <TrendingUp fontSize="small" color="success" />}
                    {trendType === 'down' && <TrendingDown fontSize="small" color="error" />}
                    <Typography
                        variant="body2"
                        color={trendType === 'up' ? 'success.main' : trendType === 'down' ? 'error.main' : 'textSecondary'}
                        sx={{ fontWeight: 500 }}
                    >
                        {trend}
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export const ChartCard: React.FC<ChartCardProps> = ({ title, children, height = 400, action }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 3,
                height: '100%',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                border: '1px solid rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D3748' }}>
                    {title}
                </Typography>
                {action}
            </Box>
            <Box sx={{ flexGrow: 1, height: height, width: '100%', minHeight: height }}>
                {children}
            </Box>
        </Paper>
    );
};

export const CandidateCard: React.FC<CandidateCardProps> = ({ name, score, type, tags, status, avatarUrl, onClick }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: 3,
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.03)',
                border: '1px solid #F0F0F0',
                transition: 'all 0.2s',
                cursor: 'pointer',
                '&:hover': {
                    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.06)',
                    borderColor: '#E0E0E0'
                }
            }}
            onClick={onClick}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar src={avatarUrl} sx={{ width: 48, height: 48, bgcolor: '#E3F2FD', color: '#1976d2', fontWeight: 'bold' }}>
                        {name[0]}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2D3748' }}>
                            {name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {type} Interview
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: score >= 85 ? '#2E7D32' : score >= 70 ? '#ED6C02' : '#D32F2F' }}>
                        {score}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        Total Score
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="textSecondary"></Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>{score}%</Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={score}
                    sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#F5F5F5',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: score >= 85 ? '#4CAF50' : score >= 70 ? '#FF9800' : '#F44336',
                            borderRadius: 3
                        }
                    }}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {tags.map((tag, index) => (
                    <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{
                            bgcolor: '#F5F7FA',
                            color: '#546E7A',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            borderRadius: '8px'
                        }}
                    />
                ))}
            </Box>
        </Paper>
    );
};
