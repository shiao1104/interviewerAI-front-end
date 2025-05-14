import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface TableColumn {
  id: string;
  label: string;
  render?: (value: string, row: string) => React.ReactNode;
  textAlign?: string | undefined;
}

interface QuestionTableProps {
  columns: TableColumn[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}

export default function DataTable({ columns, data }: QuestionTableProps) {
  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: "10px", minHeight: "60vh" }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                sx={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  textAlign: column.textAlign,
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
            >
              {columns.map((column) => (
                <TableCell
                  key={`${row.id}-${column.id}`}
                  style={{ textAlign: column.textAlign }}
                >
                  {column.render
                    ? column.render(row[column.id], row)
                    : row[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
