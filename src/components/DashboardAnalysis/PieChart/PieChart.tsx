import React from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import classes from "./PieChart.module.scss";

const data = [
  { name: "Group A", value: 800 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieChartComponent: React.FC = () => {
  return (
    <div className={classes.piechart}>
      <h3 className={classes["piechart__title"]}>نسبة البضاعه</h3>
      <PieChart width={600} height={250}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
      <ul className={classes["piechart__options"]}>
        <li className={classes["piechart__option"]}>
          <span
            className={classes["piechart__option--bullet"]}
            style={{ backgroundColor: COLORS[0] }}
          ></span>
          <span
            className={classes["piechart__option--value"]}
            style={{ color: COLORS[0] }}
          >
            قلم
          </span>
        </li>
        <li className={classes["piechart__option"]}>
          <span
            className={classes["piechart__option--bullet"]}
            style={{ backgroundColor: COLORS[1] }}
          ></span>
          <span
            className={classes["piechart__option--value"]}
            style={{ color: COLORS[1] }}
          >
            كشكول
          </span>
        </li>
        <li className={classes["piechart__option"]}>
          <span
            className={classes["piechart__option--bullet"]}
            style={{ backgroundColor: COLORS[2] }}
          ></span>
          <span
            className={classes["piechart__option--value"]}
            style={{ color: COLORS[2] }}
          >
            كراس
          </span>
        </li>
        <li className={classes["piechart__option"]}>
          <span
            className={classes["piechart__option--bullet"]}
            style={{ backgroundColor: COLORS[3] }}
          ></span>
          <span
            className={classes["piechart__option--value"]}
            style={{ color: COLORS[3] }}
          >
            زينه
          </span>
        </li>
      </ul>
    </div>
  );
};

export default PieChartComponent;
