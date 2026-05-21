import { db } from './database'

export async function deleteSession(sessionId: number): Promise<void> {
  await db.transaction('rw', [db.sessions, db.setLogs], async () => {
    await db.setLogs.where('sessionId').equals(sessionId).delete()
    await db.sessions.delete(sessionId)
  })
}
