/**
 * Route: DELETE /notes
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const util = require('./util.js');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;

exports.handler = async (event) => {
  try {
    let timestamp = parseInt(event.pathParameters.timestamp);
    let params = {
      TableName: tableName,
      Key: {
        user_id: util.getUserId(event.headers),
        timestamp: timestamp
      }
    };

    await dynamoDb.delete(params).promise();

    return {
      statusCode: 200,
      headers: util.getResponseHeaders()
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
