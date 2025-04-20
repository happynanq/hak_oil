import { Flex, Table } from "antd";
import { color } from "d3";
const baseStyle = {
  width: "25%",
  height: 54,
};

export function TestTemplate() {
  return (
    <Flex vertical={0}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          style={Object.assign(Object.assign({}, baseStyle), {
            backgroundColor: i % 2 ? "#1677ff" : "#1677ffbf",
          })}
        ></div>
      ))}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          style={Object.assign(Object.assign({}, baseStyle), {
            backgroundColor: i % 2 ? "#1677ff" : "#1677ffbf",
          })}
        />
      ))}
    </Flex>
  );
}
