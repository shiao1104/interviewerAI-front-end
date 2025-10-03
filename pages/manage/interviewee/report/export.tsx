import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Chip,
    Stack,
    Divider,
    useTheme,
    LinearProgress,
    Paper,
} from "@mui/material";
import {
    Description,
    AccessTime,
    Person,
    InfoOutline,
    DateRange,
    KeyboardBackspace,
} from "@mui/icons-material";
import CircleProgress from "@/components/common/manage/CircleProgress";
import Layout from "@/components/Layout/ManageLayout";
import Image from "next/image";
import pic from "@/public/image/pic.jpg";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function IntervieweeDetail() {
    const router = useRouter();
    const theme = useTheme();
    const [passed, setPassed] = useState('');
    const aiReportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleExportAIReport = async () => {
            if (!aiReportRef.current) return;

            const canvas = await html2canvas(aiReportRef.current, {
                scale: 2,
                useCORS: true,
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            const margin = 10;

            const usableWidth = pdfWidth - margin * 2;
            const usableHeight = pdfHeight - margin * 2;

            const imgHeight = (canvas.height * usableWidth) / canvas.width;

            const finalHeight = imgHeight > usableHeight ? usableHeight : imgHeight;
            const finalWidth = imgHeight > usableHeight ? (canvas.width * usableHeight) / canvas.height : usableWidth;

            pdf.addImage(imgData, "PNG", margin, margin, finalWidth, finalHeight);
            pdf.save("AI-面試分析報告.pdf");

            setTimeout(() => window.close(), 500);

        };
        handleExportAIReport();
    }, []);


    const scoreItems = [
        {
            key: "language",
            title: "語言表達力",
            label: "表達能力",
            color: theme.palette.success.main,
        },
        {
            key: "attitude",
            title: "積極度分析",
            label: "積極度",
            color: theme.palette.info.main,
        },
        {
            key: "technical",
            title: "技術能力預測",
            label: "技術能力",
            color: theme.palette.warning.main,
        },
        {
            key: "teamwork",
            title: "團隊合作",
            label: "合作能力",
            color: theme.palette.primary.main,
        },
    ];

    // Simulated data
    const [data] = useState({
        name: "王小明",
        email: "ming@example.com",
        phone: "0912-345-678",
        position: "前端工程師",
        resumeUrl: "#",
        interviewDate: "2025-05-20",
        interviewTime: "14:30 - 15:30",
        confirmStatus: "已面試",
        audioUrl: "#",
        videoUrl: "#",
        transcriptUrl: "#",
        emotionAnalysisUrl: "#",
        scores: {
            language: 83,
            attitude: 75,
            technical: 80,
            overall: 85,
        },
        comments: {
            language: "應徵者展現了良好的溝通能力，用詞精準，能清晰表達技術概念。",
            attitude: "面試過程中表現自信，態度積極主動，表情自然，對問題回應迅速。",
            technical:
                "根據技術問題的回答分析，應徵者具備所需的前端開發技能，特別是在React方面表現出色。",
            overall:
                "整體而言，高度推薦此應徵者。專業素養良好，技術能力符合職位要求，建議進入下一輪面試。",
        },
    });

    const interviewAnalysis = [
        {
            question: "請描述您過去的專案經驗",
            answer: "我曾負責一個React專案，協助建構UI元件與狀態管理...",
            tags: ["React", "前端開發", "團隊合作"],
            aiComment: "展現了良好的技術理解與解決問題能力。",
        },
        {
            question: "請說明您如何處理團隊內的溝通問題",
            answer: "我會主動開啟溝通會議，確保彼此理解一致。",
            tags: ["溝通能力", "主動協調"],
            aiComment: "展現了成熟的溝通技巧與主動處理問題的態度。",
        },
    ];

    return (
        <Layout>
            <Box sx={{ maxWidth: "1200px", margin: "0 auto", p: 3 }}>
                {/* Header with back button */}
                <Button
                    startIcon={<KeyboardBackspace />}
                    onClick={() => router.push("/manage/interviewee")}
                >
                    返回列表
                </Button>

                <div ref={aiReportRef}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3, mt: 3 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <InfoOutline color="primary" sx={{ fontSize: "35px" }} />
                            應徵者資訊
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Chip
                            label={`綜合評分: ${data.scores.overall}`}
                            color="primary"
                            size="medium"
                            sx={{
                                fontWeight: "bold",
                                py: 2,
                                px: 1,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                "& .MuiChip-label": { px: 2 },
                            }}
                        />
                    </Box>

                    <Grid container sx={{ display: "grid", gap: "1rem" }}>
                        {/* 應徵者資訊 */}
                        <Grid
                            sx={{
                                display: "grid",
                                gap: "1rem",
                            }}
                        >
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: 2,
                                    border: `1px solid ${theme.palette.divider}`,
                                    height: "100%",
                                }}
                            >
                                <CardContent>
                                    <Grid
                                        container
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "2fr auto 1fr",
                                            gap: "1rem",
                                        }}
                                    >
                                        {/* 資訊區 - 左邊 */}
                                        <Grid sx={{ display: "flex", alignItems: "center" }}>
                                            <Box
                                                sx={{
                                                    width: "175px",
                                                    height: "225px",
                                                    overflow: "hidden",
                                                    marginRight: "1rem",
                                                }}
                                            >
                                                <Image src={pic} alt="" width={175} />
                                            </Box>
                                            <Box>
                                                <Box sx={{ mb: 3 }}>
                                                    <Typography variant="h6">{data.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {data.position}
                                                    </Typography>
                                                </Box>

                                                <Divider sx={{ my: 2 }} />

                                                <Stack spacing={2} sx={{ mb: 3 }}>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <Person
                                                            fontSize="small"
                                                            sx={{ color: "text.secondary", mr: 1 }}
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{ width: "80px" }}
                                                        >
                                                            Email:
                                                        </Typography>
                                                        <Typography variant="body2">{data.email}</Typography>
                                                    </Box>

                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <Person
                                                            fontSize="small"
                                                            sx={{ color: "text.secondary", mr: 1 }}
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{ width: "80px" }}
                                                        >
                                                            電話:
                                                        </Typography>
                                                        <Typography variant="body2">{data.phone}</Typography>
                                                    </Box>

                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <Description
                                                            fontSize="small"
                                                            sx={{ color: "text.secondary", mr: 1 }}
                                                        />
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{ width: "80px" }}
                                                        >
                                                            應徵職位:
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {data.position}
                                                        </Typography>
                                                    </Box>
                                                </Stack>

                                                <Button
                                                    variant="outlined"
                                                    fullWidth
                                                    href={data.resumeUrl}
                                                    startIcon={<Description />}
                                                    sx={{
                                                        borderRadius: 2,
                                                        textTransform: "none",
                                                    }}
                                                >
                                                    查看履歷
                                                </Button>
                                            </Box>
                                        </Grid>

                                        {/* 分隔線 */}
                                        <Divider orientation="vertical" flexItem />

                                        {/* 面試排程區 - 右邊 */}
                                        <Grid>
                                            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
                                                面試排程
                                            </Typography>

                                            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                <DateRange
                                                    fontSize="small"
                                                    sx={{ color: "text.secondary", mr: 1 }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ width: "80px" }}
                                                >
                                                    日期:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {data.interviewDate}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                                <AccessTime
                                                    fontSize="small"
                                                    sx={{ color: "text.secondary", mr: 1 }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ width: "80px" }}
                                                >
                                                    時間:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {data.interviewTime}
                                                </Typography>
                                            </Box>

                                            <Chip
                                                label={data.confirmStatus}
                                                color="success"
                                                size="small"
                                                variant="outlined"
                                                sx={{ borderRadius: 1 }}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        {data.confirmStatus == "已面試" ? (
                            <>
                                {/* AI 面試分析報告 */}
                                <Grid>
                                    {/* AI Analysis Tabs */}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            borderRadius: 2,
                                            border: `1px solid ${theme.palette.divider}`,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <Box sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
                                            <Typography variant="h6" fontWeight="medium">
                                                AI 面試分析報告
                                            </Typography>
                                        </Box>
                                        <Box sx={{ p: 3 }}>
                                            <Box sx={{ display: "flex" }}>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        mr: 3,
                                                    }}
                                                >
                                                    <CircleProgress
                                                        score={data.scores.overall}
                                                        label="總體評分"
                                                        color={theme.palette.primary.main}
                                                        size={160}
                                                    />
                                                </Box>
                                                <Typography
                                                    variant="body1"
                                                    sx={{ px: 2, margin: "2rem 0" }}
                                                >
                                                    {data.comments.overall}
                                                </Typography>
                                            </Box>

                                            <Grid
                                                container
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns: "1fr 1fr",
                                                    gap: "1rem",
                                                }}
                                            >
                                                {scoreItems.map((item) => (
                                                    <Grid key={item.key}>
                                                        <Card
                                                            sx={{
                                                                p: 2,
                                                                borderRadius: 2,
                                                                border: `1px solid ${theme.palette.divider}`,
                                                            }}
                                                        >
                                                            <Typography variant="subtitle2" gutterBottom>
                                                                {item.title}
                                                            </Typography>
                                                            <Box sx={{ mb: 1 }}>
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        justifyContent: "space-between",
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                    >
                                                                        {item.label}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body2"
                                                                        fontWeight="medium"
                                                                    >
                                                                        {
                                                                            data.scores[
                                                                            item.key as keyof typeof data.scores
                                                                            ]
                                                                        }
                                                                        /100
                                                                    </Typography>
                                                                </Box>
                                                                <LinearProgress
                                                                    variant="determinate"
                                                                    value={
                                                                        data.scores[
                                                                        item.key as keyof typeof data.scores
                                                                        ]
                                                                    }
                                                                    sx={{
                                                                        mt: 0.5,
                                                                        height: 6,
                                                                        borderRadius: 3,
                                                                        bgcolor: theme.palette.grey[100],
                                                                        "& .MuiLinearProgress-bar": {
                                                                            bgcolor: item.color,
                                                                            borderRadius: 3,
                                                                        },
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                                sx={{ mt: 2 }}
                                                            >
                                                                {
                                                                    data.comments[
                                                                    item.key as keyof typeof data.comments
                                                                    ]
                                                                }
                                                            </Typography>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </Paper>
                                </Grid>

                                {/* 問題分析 */}
                                <Grid>
                                    <Paper
                                        sx={{
                                            borderRadius: 2,
                                            border: `1px solid ${theme.palette.divider}`,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <Box sx={{ p: 2, bgcolor: theme.palette.background.paper }}>
                                            <Typography variant="h6" fontWeight="medium">
                                                問題分析
                                            </Typography>

                                            {interviewAnalysis.map((item, index) => (
                                                <Card
                                                    key={index}
                                                    sx={{
                                                        mt: 2,
                                                        p: 2,
                                                        borderRadius: 2,
                                                        border: `1px solid ${theme.palette.divider}`,
                                                    }}
                                                >
                                                    <Typography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                                                        問題 {index + 1}: {item.question}
                                                    </Typography>

                                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                                        面試者回答：
                                                    </Typography>
                                                    <Typography sx={{ mb: 1 }}>{item.answer}</Typography>

                                                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                        重點標籤：
                                                    </Typography>
                                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                                                        {item.tags.map((tag, i) => (
                                                            <Chip key={i} label={tag} color="primary" variant="outlined" />
                                                        ))}
                                                    </Box>

                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        AI評論：
                                                    </Typography>
                                                    <Typography>{item.aiComment}</Typography>
                                                </Card>
                                            ))}
                                        </Box>
                                    </Paper>
                                </Grid>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        mt: 3,
                                        p: 3,
                                        borderRadius: 2,
                                        bgcolor: passed === 'yes' ? '#f0f9ff' : '#fef2f2',
                                        border: passed === 'yes' ? '1px solid #bae6fd' : '1px solid #fecaca'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: passed === 'yes' ? '#0369a1' : '#dc2626',
                                            fontWeight: 500,
                                            textAlign: 'center'
                                        }}
                                    >
                                        {passed === 'yes'
                                            ? '✓ 恭喜！應徵者已通過初步面試，請安排後續面試時間。'
                                            : '✗ 應徵者未通過此次面試，感謝參與。'
                                        }
                                    </Typography>
                                </Paper>
                            </>
                        ) : (
                            <Paper
                                sx={{
                                    borderRadius: 2,
                                    border: `1px solid ${theme.palette.divider}`,
                                    padding: "2rem",
                                    textAlign: "center",
                                }}
                            >
                                尚未接受面試
                            </Paper>
                        )}
                    </Grid>
                </div>
            </Box>
        </Layout>
    );
}
