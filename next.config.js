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
    ];
  },
};

module.exports = nextConfig;
