import Layout from "@/components/Layout/manage/Layout";
import { useState } from "react";
import styles from "@/styles/pages/manage/Questions.module.scss";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Button,
} from "@mui/material";
import { questionsData, questionTableTitle } from "@/lib/data/testData";
import InputField from "@/components/common/InputField";
import { questionsSearchData } from "@/lib/data/questionsSearchData";
import { useForm } from "react-hook-form";
import { Search } from "@mui/icons-material";
import SearchBar from "@/components/common/searchBar";

export default function Questions() {
  const formProps = useForm();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "簡單":
        return "success";
      case "中等":
        return "warning";
      case "困難":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          p: 3,
          margin: "auto",
          width: "80vw",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 4, color: "#fff", fontWeight: "bold" }}
        >
          面試問題管理
        </Typography>

        <Box sx={{backgroundColor: '#fff', borderRadius: '10px'}}>
          <Grid className={styles.searchBarWrap}>
            {questionsSearchData.map((item, index) => (
              <Grid key={index}>
                <SearchBar
                  textClassName={styles.searchLabel}
                  name={item.name}
                  label={item.label}
                  type={item.type}
                  formProps={formProps}
                  dropdownData={item.dropdownData}
                />
              </Grid>
            ))}

            <Button
              endIcon={<Search />}
              variant="outlined"
              sx={{
                height: "43px",
                color: "#000",
                borderColor: "#000",
                transition: "scale .5s",
                "&:hover": {
                  color: "#000",
                  borderColor: "#000",
                  backgroundColor: "#fff",
                  scale: 1.3
                },
              }}
              onClick={() => {
                const values = formProps.getValues();
                console.log("搜尋欄位資料:", values);
              }}
            >
              搜尋
            </Button>
          </Grid>

          <TableContainer component={Paper} sx={{ borderRadius: '10px' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  {questionTableTitle.map((item, index) => (
                    <TableCell key={index} sx={{ fontWeight: "bold" }}>
                      {item}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {questionsData.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell>{row.position}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.question}</TableCell>
                    <TableCell>{row.timeAllowed}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.difficulty}
                        color={getDifficultyColor(row.difficulty)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Layout>
  );
}
