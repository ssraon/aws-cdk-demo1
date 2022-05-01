
const {v4 : uuidv4} = require('uuid');

exports.handler = async (/** @type {{ queytStringParameters: any; }} */ event, /** @type {any} */ context) => {
    // const queries = JSON.stringify(event.queytStringParameters);
    console.log('***************current UUID ********************** ' + uuidv4());
    return {
      statusCode: 200,
      body: `Hello there , here is the UUID ${uuidv4()}`
    }
  };