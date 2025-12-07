import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './StepResponseChart.module.css';

interface ChartData {
  time: number;
  position: number;
  setpoint: number;
  error: number;
}

interface StepResponseChartProps {
  data: ChartData[];
  setpoint: number;
}

/**
 * Displays the PID response over time
 * Shows both position and setpoint, with setpoint as reference line
 */
export const StepResponseChart: React.FC<StepResponseChartProps> = ({
  data,
  setpoint,
}) => {
  if (data.length === 0) {
    return (
      <div className={styles.placeholder}>
        <p>Initializing simulation...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3>Step Response</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis label={{ value: 'Position', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            formatter={(value: number) => value.toFixed(3)}
            labelFormatter={(label: number) => `t = ${label.toFixed(2)}s`}
          />
          <Legend />

          {/* System response */}
          <Line
            type="monotone"
            dataKey="position"
            stroke="#3b82f6"
            dot={false}
            isAnimationActive={false}
            name="System Response"
            strokeWidth={2}
          />

          {/* Setpoint reference */}
          <Line
            type="linear"
            dataKey="setpoint"
            stroke="#10b981"
            dot={false}
            isAnimationActive={false}
            name="Setpoint"
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Performance indicators */}
      <div className={styles.indicators}>
        <div className={styles.indicator}>
          <span className={styles.label}>Peak Value:</span>
          <span className={styles.value}>
            {Math.max(...data.map(d => d.position)).toFixed(3)}
          </span>
        </div>
        <div className={styles.indicator}>
          <span className={styles.label}>Final Value:</span>
          <span className={styles.value}>
            {data[data.length - 1].position.toFixed(3)}
          </span>
        </div>
        <div className={styles.indicator}>
          <span className={styles.label}>Final Error:</span>
          <span className={styles.value}>
            {Math.abs(data[data.length - 1].error).toFixed(3)}
          </span>
        </div>
      </div>
    </div>
  );
};
