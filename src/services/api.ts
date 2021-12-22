import db from "../db/database-config";
import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { COLLECTIONS } from "../constants";
import { DatabaseCollectionsType } from "../interfaces";
import { SendRequestData, UpdateRequestData } from "../interfaces";

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

//{collectionName: COLLECTIONS, data: DatabaseCollectionsType}
export const sendData = async (requestData: SendRequestData) => {
  await addDoc(collection(db, requestData.collectionName), requestData.data);
};

export const updateData = async (requestData: UpdateRequestData) => {
  const { collectionName, docId, newData } = requestData;
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, newData);
};
