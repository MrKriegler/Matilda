use matilda
db.sequences.insert({
  '_id': 'task_id',
  'nextIndex': 0
})

db.tasks.createIndex({ id: 1 }, { unique: true })
db.tasks.createIndex({ enabled: 1, status: 1 })
db.tasks.createIndex({ enabled: 1, type: 1, status: 1 })
db.tasks.createIndex({ userId: 1, enabled: 1 })
db.tasks.createIndex({ scheduledDate: 1, enabled: 1 })
db.tasks.createIndex({ ref: 1 }, { unique: true, sparse: true })
