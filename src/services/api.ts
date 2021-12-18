import db from "../db/database-config";
import {
  collection,
  query,
  where,
  getDocs,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { COLLECTIONS } from "../constants";
import { DatabaseCollectionsType } from "../types";

export const readData = async (collectionName: COLLECTIONS) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const data: DatabaseCollectionsType[] = [];
  querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
    let documentDataWithId: any = {
      id: doc.id,
      ...doc.data(),
    };
    data.push(documentDataWithId);
  });
  return data;
};
