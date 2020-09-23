import { useSocket } from 'use-socketio';
import { useState } from 'react';
import { useSessionStorageState } from 'ahooks';

function useRestarting(onConnected?: () => void) {
  const [count, setCount] = useSessionStorageState('restarting_count', 0);

  const { socket } = useSocket('connect', () => {
    setCount(count + 1);
    if (count === 0) return;
    setRestarting(false);
    onConnected?.();
  });

  useSocket('disconnect', () => {
    setRestarting(true);
  });

  const [restarting, setRestarting] = useState(count === 0 ? false : !socket.connected);

  return { restarting };
}

export default useRestarting;
