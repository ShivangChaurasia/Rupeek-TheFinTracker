import { useReducer, useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { isPending: true, document: null, success: false, error: null };
    case "ADDED_DOCUMENT":
      return { isPending: false, document: action.payload, success: true, error: null };
    case "DELETED_DOCUMENT":
      return { isPending: false, document: null, success: true, error: null };
    case "ERROR":
      return { isPending: false, document: null, success: false, error: action.payload };
    default:
      return state;
  }
};

export const useFirestore = (collectionName) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  const addDocument = async (doc) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const createdAt = serverTimestamp();
      const addedDocument = await addDoc(collection(db, collectionName), { ...doc, createdAt });

      if (!isCancelled) {
        dispatch({ type: "ADDED_DOCUMENT", payload: addedDocument });
      }
    } catch (err) {
      if (!isCancelled) {
        dispatch({ type: "ERROR", payload: err.message });
      }
    }
  };

  const deleteDocument = async (id) => {
    dispatch({ type: "IS_PENDING" });

    try {
      await deleteDoc(doc(db, collectionName, id));

      if (!isCancelled) {
        dispatch({ type: "DELETED_DOCUMENT" });
      }
    } catch (err) {
      console.log(err)
      if (!isCancelled) {
        dispatch({ type: "ERROR", payload: "Could not delete" });
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { addDocument, deleteDocument, response };
};