import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Box,
} from "@mui/material";
import { useState, useMemo } from "react";

type SortDirection = "asc" | "desc";

interface TableColumn {
  maxWidth?: string;
  id: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: string, row: any) => React.ReactNode;
  textAlign?: string | undefined;
  sortable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortComparator?: (a: any, b: any) => number;
}

interface QuestionTableProps {
  columns: TableColumn[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  defaultSortColumn?: string;
  defaultSortDirection?: SortDirection;
  defaultRowsPerPage?: number;
  rowsPerPageOptions?: number[];
}

export default function DataTable({
  columns,
  data,
  defaultSortColumn,
  defaultSortDirection = "asc",
  defaultRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25, 50],
}: QuestionTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(
    defaultSortColumn || null
  );
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(defaultSortDirection);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column?.sortable) return;

    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultComparator = (a: any, b: any, column: TableColumn): number => {
    const aValue = a[column.id];
    const bValue = b[column.id];

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (typeof aValue === "number" && typeof bValue === "number") {
      return aValue - bValue;
    }

    const aDate = new Date(aValue);
    const bDate = new Date(bValue);
    if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
      return aDate.getTime() - bDate.getTime();
    }

    return String(aValue)
      .toLowerCase()
      .localeCompare(String(bValue).toLowerCase());
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    const column = columns.find((col) => col.id === sortColumn);
    if (!column?.sortable) return data;

    const comparator =
      column.sortComparator || ((a, b) => defaultComparator(a, b, column));

    return [...data].sort((a, b) => {
      const result = comparator(a, b);
      return sortDirection === "asc" ? result : -result;
    });
  }, [data, sortColumn, sortDirection, columns]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, page, rowsPerPage]);

  const renderHeaderCell = (column: TableColumn) => {
    if (!column.sortable) {
      return (
        <TableCell
          key={column.id}
          sx={{
            fontWeight: "bold",
            fontSize: "16px",
            textAlign: `${column.textAlign}`,
          }}
        >
          {column.label}
        </TableCell>
      );
    }

    return (
      <TableCell
        key={column.id}
        sx={{
          fontWeight: "bold",
          fontSize: "16px",
          textAlign: `${column.textAlign}`,
        }}
      >
        <TableSortLabel
          active={sortColumn === column.id}
          direction={sortColumn === column.id ? sortDirection : "asc"}
          onClick={() => handleSort(column.id)}
          sx={{
            "& .MuiTableSortLabel-icon": {
              opacity: sortColumn === column.id ? 1 : 0.5,
            },
            "&:hover .MuiTableSortLabel-icon": {
              opacity: 1,
            },
          }}
        >
          {column.label}
        </TableSortLabel>
      </TableCell>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: "10px", minHeight: "60vh" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              {columns.map(renderHeaderCell)}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
              >
                {columns.map((column) => (
                  <TableCell
                    sx={{ maxWidth: column.maxWidth, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    key={`${row.id}-${column.id}`}
                    style={{ 'textAlign': `${column.textAlign}` }}
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

      <TablePagination
        component="div"
        count={sortedData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        labelRowsPerPage="每頁顯示筆數:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} 共 ${count !== -1 ? count : `超過 ${to}`} 筆`
        }
        sx={{
          borderTop: "1px solid #e0e0e0",
          "& .MuiTablePagination-toolbar": {
            paddingLeft: 2,
            paddingRight: 2,
          },
          "& .MuiTablePagination-selectLabel": {
            marginBottom: 0,
          },
          "& .MuiTablePagination-displayedRows": {
            marginBottom: 0,
          },
        }}
      />
    </Box>
  );
}
