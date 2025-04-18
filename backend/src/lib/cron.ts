import cron from 'cron'
import https from 'https'

const job = new cron.CronJob('*/12 * * * *', () => {
  https
    .get(String(`${process.env.API_URL}/api/health`), (res) => {
      if (res.statusCode === 200) {
        console.log('API is up and running')
      } else {
        console.log('API is down')
      }
    })
    .on('error', (err) => {
      console.log('Error while sending request: ', err.message)
    })
})

export default job
