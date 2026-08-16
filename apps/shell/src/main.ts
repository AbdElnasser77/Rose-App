import { registerRemotes } from '@module-federation/enhanced/runtime';

fetch('/module-federation.manifest.json')
  .then((res) => res.json())
  .then((remotes: Record<string, string>) => {

    const processEnv = (window as any).process?.env || {};
    const productionRemoteUrl = processEnv['NX_ROSE_APP_URL'];

    if (productionRemoteUrl && remotes['roseApp']) {
      remotes['roseApp'] = productionRemoteUrl;
    }

    return Object.entries(remotes).map(([name, entry]) => ({ name, entry }));
  })
  .then((remotes) => registerRemotes(remotes))
  .then(() => import('./bootstrap').catch((err) => console.error(err)));
