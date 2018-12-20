import { db } from "mongodb";

db.sequences.insert({
  '_id': 'task_id',
  'nextIndex': 0
});