import { firestore } from "@/app/[locale]/fireBaseInit";
import { Ad, QuestionnaireData } from "@/app/types/types";
import { collection, doc, getDoc, getDocs, setDoc } from "@firebase/firestore";

export const createNewProfile = async (documentId: string, data: QuestionnaireData) => {
    const collectionRef = collection(firestore, "profiles");
    const documentRef = doc(collectionRef, documentId);
    await setDoc(documentRef, data);
};

export const getProfileById = async (documentId: string) => {
    const documentRef = doc(firestore, "profiles", documentId);

    const documentSnapshot = await getDoc(documentRef);
    if (documentSnapshot.exists()) {
        return documentSnapshot.data();
    } else {
        return null;
    }
};

export const getAllGeneratedAds = async () => {
    const collectionRef = collection(firestore, "generated-ads");
    const querySnapshot = await getDocs(collectionRef);
    const ads: Ad[] = [];
    querySnapshot.forEach((doc) => {
        ads.push(doc.data() as Ad);
    });
    return ads;
};