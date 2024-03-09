/**
 * Route: POST /notes
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const moment = require('moment');
const uuid = require('uuid')
const util = require('./util.js');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
  try {
    let item = JSON.parse(event.body).Item;
    item.user_id = util.getUserId(event.headers);
    item.username = util.getUsername(event.headers);
    item.note_id = `${item.user_id}:${uuid.v4()}`;
    item.timestamp = moment().unix();
    moment().add(90, 'days').unix();

    let data = await dynamoDb.put({
      TableName: tableName,
      Item: item
    }).promise();

    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(item)
    }
  } catch (err) {
    console.error('error', err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        error: err.name ? err.name : 'exception',
        message: err.message ? err.message : 'message'
      })
    }
  }
}
