import { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

export default function DocsRedirect() {
  const history = useHistory();

  useEffect(() => {
    history.replace('/docs/introduction/overview');
  }, [history]);

  return null;
}