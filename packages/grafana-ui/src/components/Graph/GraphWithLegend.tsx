// Libraries
import _ from 'lodash';
import React from 'react';

import { css } from 'emotion';
import { Graph, GraphProps } from './Graph';
import { LegendRenderOptions } from '../Legend/Legend';
import { GraphLegend } from './GraphLegend';

export type SeriesOptionChangeHandler<TOption> = (label: string, option: TOption) => void;
export type SeriesColorChangeHandler = SeriesOptionChangeHandler<string>;
export type SeriesAxisToggleHandler = SeriesOptionChangeHandler<boolean>;

export interface GraphWithLegendProps extends GraphProps, LegendRenderOptions {
  decimals?: number;
  isLegendVisible: boolean;
  renderLegendAsTable: boolean;
  sortLegendBy?: string;
  sortLegendDesc?: boolean;
  onSeriesColorChange: SeriesColorChangeHandler;
  onSeriesAxisToggle?: SeriesAxisToggleHandler;
  onSeriesToggle?: (label: string, event: React.MouseEvent<HTMLElement>) => void;
  onToggleSort: (sortBy: string, sortDesc: boolean) => void;
}

const getGraphWithLegendStyles = ({ placement }: GraphWithLegendProps) => ({
  wrapper: css`
    display: flex;
    flex-direction: ${placement === 'under' ? 'column' : 'row'};
    height: 100%;
  `,
  graphContainer: css`
    min-height: 65%;
    flex-grow: 1;
  `,
  legendContainer: css`
    padding: 10px 0;
  `,
});

export const GraphWithLegend: React.FunctionComponent<GraphWithLegendProps> = (props: GraphWithLegendProps) => {
  const {
    series,
    timeRange,
    width,
    height,
    showBars,
    showLines,
    showPoints,
    sortLegendBy,
    sortLegendDesc,
    isLegendVisible,
    renderLegendAsTable,
    placement,
    onSeriesAxisToggle,
    onSeriesColorChange,
    onSeriesToggle,
    onToggleSort,
  } = props;
  const { graphContainer, wrapper, legendContainer } = getGraphWithLegendStyles(props);

  return (
    <div className={wrapper}>
      <div className={graphContainer}>
        <Graph
          series={series.filter(s => !!s.isVisible)}
          timeRange={timeRange}
          showLines={showLines}
          showPoints={showPoints}
          showBars={showBars}
          width={width}
          height={height}
          key={isLegendVisible ? 'legend-visible' : 'legend-invisible'}
        />
      </div>

      {isLegendVisible && (
        <div className={legendContainer}>
          <GraphLegend
            items={series.map(s => ({
              label: s.label,
              color: s.color,
              isVisible: s.isVisible,
              useRightYAxis: s.useRightYAxis,
              info: s.info || [],
            }))}
            renderLegendAsTable={renderLegendAsTable}
            placement={placement}
            sortBy={sortLegendBy}
            sortDesc={sortLegendDesc}
            onLabelClick={(item, event) => {
              if (onSeriesToggle) {
                onSeriesToggle(item.label, event);
              }
            }}
            onSeriesColorChange={onSeriesColorChange}
            onSeriesAxisToggle={onSeriesAxisToggle}
            onToggleSort={onToggleSort}
          />
        </div>
      )}
    </div>
  );
};