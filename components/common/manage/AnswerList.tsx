import { QuestionsTypes } from "@/lib/types/questionsTypes";
import { ExpandMore } from "@mui/icons-material";
import { Grid, Paper, Box, Typography, Card, Chip, IconButton, useTheme } from "@mui/material";


export default function AnswerList({ interviewAnalysis }: { interviewAnalysis: QuestionsTypes[] }) {
    const theme = useTheme();

    return (
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

                    <IconButton sx={{ mt: 2 }}>
                        <ExpandMore />
                    </IconButton>
                </Box>
            </Paper>
        </Grid>
    );
}