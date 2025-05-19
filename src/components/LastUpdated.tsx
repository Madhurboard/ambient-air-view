
import React from 'react';
import { formatTime } from '../utils/formatters';

interface LastUpdatedProps {
  timestamp: Date;
}

const LastUpdated: React.FC<LastUpdatedProps> = ({ timestamp }) => {
  return (
    <div className="text-sm text-muted-foreground mt-2 text-center">
      Last updated at {formatTime(timestamp)}
    </div>
  );
};

export default LastUpdated;
