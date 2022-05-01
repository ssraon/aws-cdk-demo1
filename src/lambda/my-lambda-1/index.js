// @ts-nocheck
const moment = require('moment');

async function handler(event) {
  console.log(`event ${JSON.stringify(event, null, 2)}`);
  console.log('VPC_ID 👉', process.env.VPC_ID);
  console.log('moment date' + moment().format());

  return {
    body: JSON.stringify({message : `test 1 ${process.env.VPC_ID} 🎉`}),
    statusCode: 200,
  };
}

module.exports = {handler};
