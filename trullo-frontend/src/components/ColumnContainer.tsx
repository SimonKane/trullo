import { type Column } from "../types";

interface Props {
  column: Column;
}

const ColumnContainer = (props: Props) => {
  const { column } = props;

  return <div>{column.title}</div>;
};

export default ColumnContainer;
