import {
  users,
  workshopSessions,
  type User,
  type UpsertUser,
  type WorkshopSession,
  type InsertWorkshopSession,
} from "../shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getWorkshopSessions(userId: string): Promise<WorkshopSession[]>;
  getWorkshopSession(id: number): Promise<WorkshopSession | undefined>;
  createWorkshopSession(session: InsertWorkshopSession): Promise<WorkshopSession>;
  updateWorkshopSession(id: number, updates: Partial<InsertWorkshopSession>): Promise<WorkshopSession | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getWorkshopSessions(userId: string): Promise<WorkshopSession[]> {
    return await db
      .select()
      .from(workshopSessions)
      .where(eq(workshopSessions.userId, userId))
      .orderBy(desc(workshopSessions.createdAt));
  }

  async getWorkshopSession(id: number): Promise<WorkshopSession | undefined> {
    const [session] = await db
      .select()
      .from(workshopSessions)
      .where(eq(workshopSessions.id, id));
    return session;
  }

  async createWorkshopSession(sessionData: InsertWorkshopSession): Promise<WorkshopSession> {
    const [session] = await db
      .insert(workshopSessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async updateWorkshopSession(
    id: number,
    updates: Partial<InsertWorkshopSession>
  ): Promise<WorkshopSession | undefined> {
    const [session] = await db
      .update(workshopSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(workshopSessions.id, id))
      .returning();
    return session;
  }
}

export const storage = new DatabaseStorage();
