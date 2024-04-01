import app from './app';

function main() {
  app.listen(process.env.PORT)
  console.log('server on port',process.env.PORT)
}

main();