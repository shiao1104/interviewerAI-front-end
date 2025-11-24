import Layout from "@/components/Layout/ManageLayout";
import { useEffect, useState } from "react";
import { Typography, Box, Button, Avatar, IconButton, useTheme, Select, MenuItem, FormControl, InputLabel, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { ArrowBack, FilterList, Settings, MoreVert, Assessment, Person, BusinessCenter, CheckCircle } from "@mui/icons-material";
import { useRouter } from "next/router";
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    ScatterChart, Scatter, ZAxis
} from "recharts";
import { KPICard, ChartCard, CandidateCard } from "@/components/Dashboard/DashboardComponents";
import InterviewAPI from "@/lib/api/InterviewAPI";
import { toast } from "react-toastify";
import { useLoading } from "@/lib/hook/loading";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import Swal from "sweetalert2";

export default function IntervieweeDashboard() {
    const router = useRouter();
    const theme = useTheme();
    const { showLoading, hideLoading } = useLoading();

    const [kpiData, setKpiData] = useState<any[]>([]);
    const [radarData, setRadarData] = useState<any[]>([]);
    const [barData, setBarData] = useState<any[]>([]);
    const [scatterData, setScatterData] = useState<any[]>([]);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [allData, setAllData] = useState<any[]>([]);
    const [openings, setOpenings] = useState<string[]>([]);
    const [selectedOpening, setSelectedOpening] = useState<string>("All");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    // Dialog State
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
    const [passed, setPassed] = useState<string>("");
    const [interviewTime, setInterviewTime] = useState<Dayjs | null>(null);
    const [rejectionReason, setRejectionReason] = useState<string>("");

    const fetchData = async () => {
        showLoading();
        try {
            const response = await InterviewAPI.getData();
            if (response.data && Array.isArray(response.data)) {
                setAllData(response.data);
                // Extract unique openings
                const uniqueOpenings = Array.from(new Set(response.data.map(item => item.opening_detail?.opening_name).filter(Boolean))) as string[];
                setOpenings(uniqueOpenings);
                processData(response.data);
            }
        } catch (err) {
            toast.error("無法獲取面試者資料，請稍後再試。");
        } finally {
            hideLoading();
        }
    };

    const processData = (data: any[]) => {
        // Filter out data with missing essential fields or 0 scores for charts
        const validScoredData = data.filter(item =>
            item.total_score && item.total_score > 0 &&
            item.interview_status === "已完成"
        );

        // 1. KPI Data
        // 1. KPI Data
        const completedCount = data.filter(item => item.interview_status === "已完成").length;
        const totalCount = data.length;
        const avgScore = validScoredData.length > 0
            ? (validScoredData.reduce((acc, curr) => acc + curr.total_score, 0) / validScoredData.length).toFixed(1)
            : "0";

        const highestScoreCandidate = validScoredData.length > 0
            ? validScoredData.reduce((prev, current) => (prev.total_score > current.total_score) ? prev : current)
            : null;

        const passedCount = data.filter(item => item.interview_result === "第一階段通過").length;
        const passedRatio = completedCount > 0 ? `${Math.round((passedCount / completedCount) * 100)}%` : "0%";

        setKpiData([
            { title: "平均總分", value: avgScore, trend: "", trendType: "neutral", icon: <Assessment />, color: "#1976d2" },
            { title: "最高分", value: highestScoreCandidate ? highestScoreCandidate.total_score : "N/A", trend: `最高分: ${highestScoreCandidate?.candidate_detail?.username || "-"}`, trendType: "neutral", icon: <Person />, color: "#ed6c02" },
            { title: "已完成面試", value: completedCount.toString(), trend: `總面試人數: ${totalCount}`, trendType: "neutral", icon: <BusinessCenter />, color: "#2e7d32" },
            { title: "已通過人數", value: passedCount.toString(), trend: `通過率: ${passedRatio}`, trendType: "neutral", icon: <CheckCircle />, color: "#9c27b0" },
        ]);

        // 2. Radar Data (Average scores)
        if (validScoredData.length > 0) {
            const avgExpression = validScoredData.reduce((acc, curr) => acc + (curr.score_expression || 0), 0) / validScoredData.length;
            const avgAttitude = validScoredData.reduce((acc, curr) => acc + (curr.score_attitude || 0), 0) / validScoredData.length;
            const avgTechnical = validScoredData.reduce((acc, curr) => acc + (curr.score_technical || 0), 0) / validScoredData.length;
            const avgCollaboration = validScoredData.reduce((acc, curr) => acc + (curr.score_collaboration || 0), 0) / validScoredData.length;

            setRadarData([
                { subject: '表達能力', A: avgExpression.toFixed(1), fullMark: 100 },
                { subject: '態度', A: avgAttitude.toFixed(1), fullMark: 100 },
                { subject: '技術能力', A: avgTechnical.toFixed(1), fullMark: 100 },
                { subject: '合作能力', A: avgCollaboration.toFixed(1), fullMark: 100 },
            ]);
        }

        // 3. Bar Data (Individual Total Scores)
        const barChartData = validScoredData.map(item => ({
            name: item.candidate_detail?.username || "Unknown",
            score: item.total_score
        })).slice(0, 10); // Limit to top 10 or recent 10
        setBarData(barChartData);

        // 4. Scatter Data (Attitude vs Technical)
        const scatterChartData = validScoredData.map(item => ({
            x: item.score_technical || 0,
            y: item.score_attitude || 0,
            z: item.total_score || 0, // Z axis as bubble size (total score)
            name: item.candidate_detail?.username || "Unknown"
        }));
        setScatterData(scatterChartData);

        // 5. Candidate Cards (Recent 8)
        const candidateList = data.slice(0, 8).map(item => ({
            name: item.candidate_detail?.username || "Unknown",
            score: item.total_score || 0,
            type: item.interview_type === "線上面試" ? "Online" : "On-site",
            tags: item.interview_result ? [item.interview_result] : [],
            status: item.interview_status === "已完成" ? "Completed" : "Scheduled",
            avatarUrl: "", // Placeholder
            interview_id: item.interview_id, // Pass ID for navigation/action
            interview_result: item.interview_result // Pass result for check
        }));
        setCandidates(candidateList);
    };

    const handleCardClick = (candidate: any) => {
        if (candidate.status === "Pending" || candidate.interview_result === "待處理") {
            setSelectedCandidateId(candidate.interview_id);
            setOpenDialog(true);
        } else {
            router.push(`/manage/interviewee/report/${candidate.interview_id}`);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedCandidateId(null);
        setPassed("");
        setInterviewTime(null);
        setRejectionReason("");
    };

    const handleSubmitResult = async () => {
        if (!selectedCandidateId) return;
        if (!passed) {
            toast.error('請選擇面試結果');
            return;
        }
        if (passed === '通過' && !interviewTime) {
            toast.error('請選擇下次面試時間');
            return;
        }

        showLoading();
        try {
            const payload = passed === '未通過'
                ? { interview_result: passed }
                : { interview_result: passed, interview_datetime: interviewTime?.toISOString() };

            await InterviewAPI.result(selectedCandidateId, payload);

            Swal.fire({
                icon: 'success',
                title: '提交成功',
                text: `面試結果已${passed === '通過' ? '通過' : '未通過'}`,
                showConfirmButton: false,
                timer: 1500
            });
            handleCloseDialog();
            fetchData(); // Refresh data
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: '提交失敗',
                text: '請稍後再試',
            });
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (allData.length > 0) {
            let filteredData = allData;

            if (selectedOpening !== "All") {
                filteredData = filteredData.filter(item => item.opening_detail?.opening_name === selectedOpening);
            }

            if (startDate) {
                filteredData = filteredData.filter(item => {
                    const itemDate = new Date(item.interview_datetime).toISOString().split('T')[0];
                    return itemDate >= startDate;
                });
            }

            if (endDate) {
                filteredData = filteredData.filter(item => {
                    const itemDate = new Date(item.interview_datetime).toISOString().split('T')[0];
                    return itemDate <= endDate;
                });
            }

            processData(filteredData);
        }
    }, [selectedOpening, startDate, endDate, allData]);

    return (
        <Layout>
            <Box
                sx={{
                    p: 4,
                    minHeight: "100vh",
                    backgroundColor: "#F5F7FA",
                }}
            >
                {/* Header */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                    <Box>
                        <Typography variant="h4" sx={{ color: "#1A202C", mb: 1 }}>
                            面試報表
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<ArrowBack />}
                            onClick={() => router.push("/manage/interviewee")}
                            sx={{ height: 40 }}
                        >
                            返回列表模式
                        </Button>
                        <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'white', borderRadius: 1 }}>
                            <InputLabel id="opening-select-label">職缺篩選</InputLabel>
                            <Select
                                labelId="opening-select-label"
                                value={selectedOpening}
                                label="職缺篩選"
                                onChange={(e) => setSelectedOpening(e.target.value)}
                            >
                                <MenuItem value="All">全部職缺</MenuItem>
                                {openings.map((opening) => (
                                    <MenuItem key={opening} value={opening}>{opening}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="開始日期"
                            type="date"
                            size="small"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ bgcolor: 'white', borderRadius: 1 }}
                        />
                        <TextField
                            label="結束日期"
                            type="date"
                            size="small"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ bgcolor: 'white', borderRadius: 1 }}
                        />
                    </Box>
                </Box>

                {/* KPI Cards */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
                        gap: 3,
                        mb: 10,
                        rowGap: 10,
                    }}
                >
                    {kpiData.map((kpi, index) => (
                        <KPICard key={index} {...kpi} />
                    ))}
                </Box>

                {/* Charts Section 1 */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", lg: "1fr 2fr" },
                        gap: 3,
                        rowGap: 10,
                        mb: 10,
                    }}
                >
                    {/* Radar Chart */}
                    <ChartCard title="詳細分析平均">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#E2E8F0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="平均" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                                <Legend />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Bar Chart */}
                    <ChartCard title="面試者總成績">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} domain={[0, 100]} />
                                <RechartsTooltip
                                    cursor={{ fill: '#F1F5F9' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="score" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Box>

                {/* Charts Section 2 - Scatter */}
                <Box sx={{ mb: 4 }}>
                    <ChartCard title="態度與技術分析" height={350}>
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis type="number" dataKey="x" name="技術" unit=" 分" domain={[0, 100]} label={{ value: '技術分數', position: 'bottom', offset: 0, fill: '#64748B' }} />
                                <YAxis type="number" dataKey="y" name="態度" unit=" 分" domain={[0, 100]} label={{ value: '態度分數', angle: -90, position: 'left', fill: '#64748B' }} />
                                <ZAxis type="number" dataKey="z" range={[60, 400]} name="總分" />
                                <RechartsTooltip
                                    cursor={{ strokeDasharray: '3 3' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <Box sx={{ bgcolor: 'white', p: 1.5, border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>{data.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">技術: {data.x} 分</Typography>
                                                    <Typography variant="body2" color="text.secondary">態度: {data.y} 分</Typography>
                                                    <Typography variant="body2" color="text.secondary">總分: {data.z}</Typography>
                                                </Box>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Scatter name="Candidates" data={scatterData} fill="#EC4899" shape="circle" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Box>

                {/* Candidate Cards Grid */}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#1A202C" }}>
                        面試者
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
                        gap: 3,
                    }}
                >
                    {candidates.map((candidate, index) => (
                        <CandidateCard
                            key={index}
                            {...candidate}
                            onClick={() => handleCardClick(candidate)}
                        />
                    ))}
                </Box>

                {/* Pending Action Dialog */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>面試結果判定</DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>是否通過此次面試？</Typography>
                            <FormControl component="fieldset">
                                <RadioGroup row value={passed} onChange={(e) => setPassed(e.target.value)}>
                                    <FormControlLabel value="通過" control={<Radio />} label="通過" />
                                    <FormControlLabel value="未通過" control={<Radio />} label="未通過" />
                                </RadioGroup>
                            </FormControl>

                            {passed === "通過" && (
                                <Box sx={{ mt: 3 }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="下次面試時間"
                                            value={interviewTime}
                                            onChange={(newValue) => setInterviewTime(newValue)}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </LocalizationProvider>
                                </Box>
                            )}

                            {passed === "未通過" && (
                                <Box sx={{ mt: 3 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="未通過原因 (選填)"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                    />
                                </Box>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>取消</Button>
                        <Button onClick={handleSubmitResult} variant="contained" color="primary">確認送出</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
}
