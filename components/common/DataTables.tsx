import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

interface TableColumn {
  id: string;
  label: string;
  render?: (value: string, row: string) => React.ReactNode;
}

interface QuestionTableProps {
  columns: TableColumn[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function DataTable({ columns, data, onEdit, onDelete }: QuestionTableProps) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                sx={{ fontWeight: "bold", fontSize: "16px" }}
              >
                {column.label}
              </TableCell>
            ))}
            {(onEdit || onDelete) && (
              <TableCell sx={{ fontWeight: "bold", fontSize: "16px" }}>
                操作
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
            >
              {columns.map((column) => (
                <TableCell key={`${row.id}-${column.id}`}>
                  {column.render ? column.render(row[column.id], row) : row[column.id]}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell>
                  {onEdit && (
                    <Button onClick={() => onEdit(row.id)}>
                      <Edit />
                    </Button>
                  )}
                  {onDelete && (
                    <Button onClick={() => onDelete(row.id)}>
                      <Delete sx={{ color: "red" }} />
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};