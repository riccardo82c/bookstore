export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra,
      apiType: process.env.API_TYPE || 'remote',
    },
  }
}
