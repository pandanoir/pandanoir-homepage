import { execSync } from 'child_process';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/prettierrc',
        destination:
          'https://gist.githubusercontent.com/pandanoir/d133eeb8f36adf5d584e51644fd3bd33/raw/4b380279555ab8aba2e3a5d8286f900fddcbded3/.prettierrc',
        permanent: true,
        basePath: false,
      },
      {
        source: '/prettier',
        destination: '/prettierrc.sh',
        permanent: true,
        basePath: false,
      },
    ];
  },
  env: {
    COMMIT_ID: execSync('git rev-parse --short HEAD').toString().trim(),
  },
};

export default nextConfig;
