import React from 'react';

// Styles
import styles from './Counter.module.css';

const Counter = (props) => {
  return (
    <div className={styles.block}>
      <div className={styles.counter}>
        <h5 className={styles.title}>Vos publications</h5>
        <span className={styles.count}>{props.postsCount}</span>
      </div>
    </div>
  );
};

export default Counter;
