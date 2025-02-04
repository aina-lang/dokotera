import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { clearAsyncStorage } from "@/legendstate/AmpelaStates";

export const db = SQLite.openDatabaseSync("ampela.db");

  // db.closeSync();
  // SQLite.deleteDatabaseSync("ampela.db");
//  clearAsyncStorage();
export const addUser = async (
  username,
  password,
  profession,
  lastMenstruationDate,
  durationMenstruation,
  cycleDuration,
  email,
  photoUri
) => {
  const statement = await db.prepareAsync(
    "INSERT INTO users (username, password, profession, lastMenstruationDate, durationMenstruation, cycleDuration, email, profileImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  try {
    const result = await statement.executeAsync([
      username,
      password,
      profession,
      lastMenstruationDate,
      durationMenstruation,
      cycleDuration,
      email,
      photoUri,
    ]);
    console.log("User added:", result);
    return result;
  } finally {
    await statement.finalizeAsync();
  }
};

export const updateUserSqlite = async (
  id,
  username,
  password,
  profession,
  lastMenstruationDate,
  durationMenstruation,
  cycleDuration,
  email,
  profileImage
) => {
  const statement = await db.prepareAsync(
    `UPDATE users 
     SET username = ?, 
         password = ?, 
         profession = ?, 
         lastMenstruationDate = ?, 
         durationMenstruation = ?, 
         cycleDuration = ?, 
         email = ?, 
         profileImage = ? 
     WHERE id = ?`
  );

  try {
    const result = await statement.executeAsync([
      username,
      password,
      profession,
      lastMenstruationDate,
      durationMenstruation,
      cycleDuration,
      email,
      profileImage,
      id,
    ]);
    console.log("User updated:", result);
    return result;
  } finally {
    await statement.finalizeAsync();
  }
};

export const getUser = async () => {
  try {
    const result = await db.getFirstAsync("SELECT * FROM users where id=1");
    return result;
  } catch (error) {
    console.error("Error getting user info", error);
    throw error;
  }
};

export const initializeDatabase = async () => {
  try {
    const result = await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL ,
        password TEXT NOT NULL,
        profession TEXT NULL,
        lastMenstruationDate DATE NULL,
        durationMenstruation INTEGER NULL,
        cycleDuration INTEGER NULL,
        email TEXT NULL,
        profileImage TEXT NULL
      );

      CREATE TABLE IF NOT EXISTS cycles_menstruels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        month TEXT NOT NULL,
        ovulationDate DATE NOT NULL,
        fecundityPeriodStart DATE NOT NULL,
        fecundityPeriodEnd DATE NOT NULL,
        startMenstruationDate DATE NOT NULL,
        endMenstruationDate DATE NOT NULL,
        nextMenstruationStartDate DATE NOT NULL,
        nextMenstruationEndDate DATE NOT NULL,
        durationMenstruation INTEGER NOT NULL,
        cycleDuration INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS first_time (
        id INTEGER PRIMARY KEY,
        status INTEGER DEFAULT 0
      );
    `);

    console.log("Database initialized:", result);
    return result;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

export const isFirstLaunch = async () => {
  try {
    let result = await db.getFirstAsync("SELECT * FROM first_time");

    // console.log(result);
    if (!result) {
      await db.runAsync("INSERT INTO first_time (status) VALUES (1);");
      result = { status: 1 };
    } else {
      result = { status: result.status };
    }

    return result;
  } catch (error) {
    return { status: true };
  }
};

export const setFirstLaunchFalse = async () => {
  try {
    const result = await db.runAsync(`
      UPDATE first_time SET status = 0 WHERE id = 1;
    `);
    // console.log("First launch flag set:", result);
    return result;
  } catch (error) {
    console.error("Error setting first launch flag:", error);
    throw error;
  }
};
export const addCycleMenstruel = async (
  fecundityPeriodEnd,
  fecundityPeriodStart,
  month,
  startMenstruationDate,
  endMenstruationDate,
  nextMenstruationStartDate,
  nextMenstruationEndDate,
  ovulationDate,
  durationMenstruation, // Added parameter
  cycleDuration // Added parameter
) => {
  try {
    // Ensure your database schema is updated to include these new columns
    const result = await db.runAsync(
      "INSERT INTO cycles_menstruels (month, ovulationDate, fecundityPeriodStart, startMenstruationDate, endMenstruationDate, fecundityPeriodEnd, nextMenstruationStartDate, nextMenstruationEndDate, durationMenstruation, cycleDuration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        month,
        ovulationDate,
        fecundityPeriodStart,
        startMenstruationDate,
        endMenstruationDate,
        fecundityPeriodEnd,
        nextMenstruationStartDate,
        nextMenstruationEndDate,
        durationMenstruation, // Added value
        cycleDuration, // Added value
      ]
    );
    console.log("Cycle menstruel ajouté :", result);
    return result;
  } catch (error) {
    console.error("Error adding cycle menstruel:", error);
    throw error;
  }
};

export const getAllCycle = async () => {
  const allRows = await db.getAllAsync("SELECT * FROM cycles_menstruels");
  for (const row of allRows) {
  }
  return allRows;
};

export const deleteCycleById = async (id) => {
  try {
    const result = await db.runAsync(
      "DELETE FROM cycles_menstruels WHERE id = ?",
      [id]
    );
    console.log("Cycle deleted:", result);
    return result;
  } catch (error) {
    console.error("Error deleting cycle:", error);
    throw error;
  }
};


export const getCycleByMonth = async (month) => {
  try {
    const result = await db.getFirstAsync("SELECT * FROM cycles_menstruels WHERE month = ?", [month]);
    console.log("Cycle fetched:", result);
    return result;
  } catch (error) {
    console.error("Error fetching cycle by month:", error);
    throw error;
  }
};


export const deleteAllCycles = async () => {
  try {
    const result = await db.runAsync("DELETE FROM cycles_menstruels");
    console.log("All cycles deleted:", result);
    return result;
  } catch (error) {
    console.error("Error deleting all cycles:", error);
    throw error;
  }
};

export const addCyclesToSQLite = async (cycles) => {
  for (const cycle of cycles) {
    await addCycleMenstruel(
      cycle.fecundityPeriodEnd,
      cycle.fecundityPeriodStart,
      cycle.month,
      cycle.startMenstruationDate,
      cycle.endMenstruationDate,
      cycle.nextMenstruationStartDate,
      cycle.nextMenstruationEndDate,
      cycle.ovulationDate,
      cycle.durationMenstruation,
      cycle.cycleDuration
    );
  }
};
