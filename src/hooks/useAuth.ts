import { useEffect } from 'react';
import { history } from 'umi';

function useAuth(pmRead) {
  useEffect(() => {
    if (!pmRead) return history.replace('/403');
  }, [pmRead]);
}

export default useAuth;
