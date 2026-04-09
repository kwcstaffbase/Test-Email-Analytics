import React from 'react';
import styles from './LoadingState.module.css';

const SKELETON_ROWS = 5;
const SKELETON_COLS = 8;

export function LoadingState(): React.ReactElement {
  return (
    <div className={styles.container} aria-label="Loading email performance data" aria-busy="true">
      <table className={styles.table}>
        <thead>
          <tr>
            {Array.from({ length: SKELETON_COLS }).map((_, i) => (
              <th key={i} scope="col">
                <span className={styles.skeletonHeader} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: SKELETON_ROWS }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {Array.from({ length: SKELETON_COLS }).map((_, colIdx) => (
                <td key={colIdx}>
                  <span className={styles.skeletonCell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
