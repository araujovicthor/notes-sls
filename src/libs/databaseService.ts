import * as AWS from 'aws-sdk';
import createHttpError from 'http-errors';

// Interfaces
interface IConfig {
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
  sslEnabled?: boolean;
}

// Put
type PutItem = AWS.DynamoDB.DocumentClient.PutItemInput;
type PutItemOutput = AWS.DynamoDB.DocumentClient.PutItemOutput;

// Batch write
type BatchWrite = AWS.DynamoDB.DocumentClient.BatchWriteItemInput;
type BatchWriteOutPut = AWS.DynamoDB.DocumentClient.BatchWriteItemOutput;

// Update
type UpdateItem = AWS.DynamoDB.DocumentClient.UpdateItemInput;
type UpdateItemOutPut = AWS.DynamoDB.DocumentClient.UpdateItemOutput;

// Query
type QueryItem = AWS.DynamoDB.DocumentClient.QueryInput;
type QueryItemOutput = AWS.DynamoDB.DocumentClient.QueryOutput;

// Get
type GetItem = AWS.DynamoDB.DocumentClient.GetItemInput;
type GetItemOutput = AWS.DynamoDB.DocumentClient.GetItemOutput;

// Delete
type DeleteItem = AWS.DynamoDB.DocumentClient.DeleteItemInput;
type DeleteItemOutput = AWS.DynamoDB.DocumentClient.DeleteItemOutput;

export const config: IConfig = { region: 'us-east-1' };

const isTest = process.env.JEST_WORKER_ID;

if (isTest) {
  config.endpoint = 'localhost:8000';
  config.sslEnabled = false;
  config.region = 'local-env';
}

AWS.config.update(config);

const documentClient = new AWS.DynamoDB.DocumentClient();

export default class DatabaseService {
  create = async (params: PutItem): Promise<PutItemOutput> => {
    try {
      return await documentClient.put(params).promise();
    } catch (error) {
      console.error(`create-error: ${error}`);

      throw new createHttpError.InternalServerError();
    }
  };

  batchCreate = async (params: BatchWrite): Promise<BatchWriteOutPut> => {
    try {
      return await documentClient.batchWrite(params).promise();
    } catch (error) {
      console.error(`batch-write-error: ${error}`);

      throw new createHttpError.InternalServerError();
    }
  };

  update = async (params: UpdateItem): Promise<UpdateItemOutPut> => {
    try {
      // result.Attributes
      return await documentClient.update(params).promise();
    } catch (error) {
      console.error(`update-error: ${error}`);

      throw new createHttpError.InternalServerError();
    }
  };

  query = async (params: QueryItem): Promise<QueryItemOutput> => {
    try {
      return await documentClient.query(params).promise();
    } catch (error) {
      console.error(`query-error: ${error}`);

      throw new createHttpError.InternalServerError();
    }
  };

  get = async (params: GetItem): Promise<GetItemOutput> => {
    console.log('DB GET - STAGE: ', process.env.STAGE);
    console.log('DB GET - params.TableName: ', params.TableName);
    console.log('DB GET - params.Key: ', params.Key);

    try {
      return await documentClient.get(params).promise();
    } catch (error) {
      console.error(`get-error - TableName: ${params.TableName}`);
      console.error(`get-error: ${error}`);

      throw new createHttpError.InternalServerError();
    }
  };

  delete = async (params: DeleteItem): Promise<DeleteItemOutput> => {
    try {
      return await documentClient.delete(params).promise();
    } catch (error) {
      console.error(`delete-error: ${error}`);

      throw new createHttpError.InternalServerError();
    }
  };
}
