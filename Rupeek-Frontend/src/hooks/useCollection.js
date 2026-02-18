import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";

export const useCollection = (collectionName, _query, _orderBy) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // 1. Use refs to wrap the arrays
  const queryRef = useRef(_query);
  const orderByRef = useRef(_orderBy);

  // 2. Update the refs only if the content of the arrays actually changes
  // This prevents the infinite loop while allowing the query to update if the user changes
  useEffect(() => {
    if (JSON.stringify(queryRef.current) !== JSON.stringify(_query)) {
      queryRef.current = _query;
    }
    if (JSON.stringify(orderByRef.current) !== JSON.stringify(_orderBy)) {
      orderByRef.current = _orderBy;
    }
  }, [_query, _orderBy]);

  useEffect(() => {
    let ref = collection(db, collectionName);

    if (queryRef.current) {
      ref = query(ref, where(...queryRef.current));
    }
    if (orderByRef.current) {
      ref = query(ref, orderBy(...orderByRef.current));
    }

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      let results = [];
      snapshot.docs.forEach(doc => {
        results.push({ ...doc.data(), id: doc.id });
      });
      
      setDocuments(results);
      setError(null);
    }, (err) => {
      console.log(err);
      setError('Could not fetch data');
    });

    return () => unsubscribe();

  // 3. We depend on the stringified versions to trigger the effect safely
  }, [collectionName, JSON.stringify(_query), JSON.stringify(_orderBy)]);

  return { documents, error };
};