import { Box, Container, Typography } from '@mui/material';
import Head from 'next/head';

export default function Custom404() {
    return (
        <>
            <Head>
                <title>404 - Page Not Found</title>
            </Head>
            <Container maxWidth="md">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        404
                    </Typography>
                    <Typography variant="h4" component="h2" gutterBottom>
                        此頁面不存在
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                        你正在尋找的頁面可能已被刪除、名稱已更改，或暂時不可用。
                    </Typography>
                </Box>
            </Container>
        </>
    );
}
