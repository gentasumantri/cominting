import { ObjectId } from 'mongodb';
import { dbConnect } from 'libs/mongodb';
import { siweServer } from 'libs/siweServer';

const getCollection = async () => {
  try {
    const conn = await dbConnect();
    return conn.db.collection('proposal');
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getSender = async (req, res) => {
  const { address } = await siweServer.getSession(req, res);
  return address;
};

/**
 * start of db action
 */

export const getProposals = async (startIndex, limit) => {
  limit = isNaN(parseInt(limit)) ? 0 : parseInt(limit);
  startIndex = isNaN(parseInt(startIndex)) ? 0 : parseInt(startIndex);

  try {
    const collection = await getCollection();
    const query = collection.find({}).sort({ createdDate: -1 });
    const queryCount = await query.count();
    const queryResult = await query.skip(startIndex).limit(limit).toArray();

    const result = {
      count: queryCount,
      data: queryResult,
      error: '',
    };

    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const getProposalById = async (id) => {
  if (!ObjectId.isValid(id)) return { data: {} };

  try {
    const collection = await getCollection();
    const query = await collection.findOne({ _id: new ObjectId(id) });

    return { data: query ? query : {} };
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const handler = async (req, res) => {
  try {
    const { query, method } = req;
    const { limit, startIndex } = query;

    switch (method) {
      case 'GET':
        {
          const { count, data } = await getProposals(startIndex, limit);
          res.status(200).json({ count: count, data: data });
        }
        break;

      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ data: [], error: e.toString() });
  }
};

export default handler;
