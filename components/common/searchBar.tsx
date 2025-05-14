import React from "react";
import { Grid, Button } from "@mui/material";
import { Search } from "@mui/icons-material";
import styles from "@/styles/components/common/manage/SearchBar.module.scss";
import InputField from "./InputField";

export type DropdownOption = {
  key: number;
  value: string;
};

export type SearchBarItem = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  dropdownData?: DropdownOption[];
};

export type SearchBarProps = {
  items: SearchBarItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formProps: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSearch?: (values: any) => void;
  className?: string;
  textClassName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleParams: (params: any) => void;
};

export default function SearchBar({
  items,
  formProps,
  handleParams,
}: SearchBarProps) {
  const { getValues } = formProps;

  const handleSearch = () => {
    const params = getValues();

    handleParams({ nowPage: "0", ...params });
  };

  return (
    <Grid className={styles.searchBarWrap}>
      {items.map((item, index) => (
        <Grid key={index}>
          <InputField
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
        sx={{ height: "43px" }}
        onClick={handleSearch}
      >
        搜尋
      </Button>
    </Grid>
  );
}
