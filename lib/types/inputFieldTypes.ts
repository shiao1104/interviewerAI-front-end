import { DropdownTypes } from "./dropdownTypes";

export type InputFieldTypes = {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    dropdownData?: DropdownTypes[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formProps?: any;
    textClassName?: string;
    optionsKey?: string;
  };