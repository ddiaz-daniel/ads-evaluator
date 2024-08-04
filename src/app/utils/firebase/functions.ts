import { firestore } from '@/app/[locale]/fireBaseInit';
import {
  Ad,
  Project,
  QuestionnaireData,
  TargetedAds,
  User,
} from '@/app/types/types';
import { collection, doc, getDoc, getDocs, setDoc } from '@firebase/firestore';

export const createNewProfile = async (
  documentId: string,
  data: QuestionnaireData
) => {
  const collectionRef = collection(firestore, 'profiles');
  const documentRef = doc(collectionRef, documentId);
  await setDoc(documentRef, data);
};

export const getProfileById = async (documentId: string) => {
  const documentRef = doc(firestore, 'profiles', documentId);

  const documentSnapshot = await getDoc(documentRef);
  if (documentSnapshot.exists()) {
    return documentSnapshot.data();
  } else {
    return null;
  }
};

export const getAllUsers = async () => {
  const collectionRef = collection(firestore, 'profiles');
  const querySnapshot = await getDocs(collectionRef);
  const users: User[] = [];
  querySnapshot.forEach((doc) => {
    users.push(doc.data() as User);
  });
  return users;
};

export const addDataToProile = async (
  documentId: string,
  data: { [key: string]: any; }
) => {
  const documentRef = doc(firestore, 'profiles', documentId);

  await setDoc(documentRef, data, { merge: true });
};

export const getAllGeneratedAds = async () => {
  const collectionRef = collection(firestore, 'generated-ads');
  const querySnapshot = await getDocs(collectionRef);
  const ads: Ad[] = [];
  querySnapshot.forEach((doc) => {
    ads.push(doc.data() as Ad);
  });
  return ads;
};

export const getAllCompoundAds = async () => {
  const collectionRef = collection(firestore, 'compound-projects');
  const querySnapshot = await getDocs(collectionRef);
  const ads: Project[] = [];
  querySnapshot.forEach((doc) => {
    ads.push(doc.data() as Project);
  });
  return ads;
};

export const getLocalAds = async () => {
  //get ads from a local json file
  const response = await fetch('/real-ads.json');
  const ads = await response.json();

  return ads;
};

export const getAllGeneratedAdsFilteredByInterests = async (
  interests: string[]
) => {
  //map the interest to the english version
  const correctInterests = interests
    .map((interest) => interestsNames[interest])
    .filter((name) => name !== undefined);
  const projects = await getAllCompoundAds();
  const ids = [
    'i7hAF0QyReHxG2fTzs2K',
    'Saci51fTJ9rFAqzizDMm',
    'UyheWjGKOi3HdwZfOX4P',
    'w3x16twFh1mwb3rIEhjB',
    'JCfAhKUJGlLUAHze9ECo',
  ];
  //filter projects by id only projects in the list of ids
  const filteredProjectsByDate = projects.filter((project) =>
    ids.includes(project.id || '')
  );

  const filteredAds = filteredProjectsByDate.flatMap((project) =>
    // Flatmap will flatten the array of ads for each project
    project.ads
      .filter((ad) =>
        // Filter the ads based on the user's interests
        ad.persona.personality.interests.some((interest) =>
          correctInterests.includes(interest)
        )
      )
      .map((ad) => ({
        ad: ad,
        id: project.id,
        relatedInterest:
          ad.persona.personality.interests.find((interest) =>
            correctInterests.includes(interest)
          ) || 'Unknown',
        relatedPersona: ad.persona.name,
      }))
  );

  return filteredAds as TargetedAds[];
};

export const getGeneratedAdById = async (id: string) => {
  const projects = await getAllCompoundAds();
  const project = projects.find((project) => project.id === id);
  if (project) {
    return project.ads;
  } else {
    return null;
  }
};

export const interestsNames: Record<string, string> = {
  sportsFitness: 'Sports and Fitness',
  travel: 'Travel',
  musicEntertainment: 'Music and Entertainment',
  artsCreativity: 'Arts and Creativity',
  readingLearning: 'Reading and Learning',
  technologyGaming: 'Technology and Gaming',
  foodCooking: 'Food and Cooking',
  natureOutdoors: 'Nature and Outdoors',
  socializingRelationships: 'Socializing and Relationships',
  fashionStyle: 'Fashion and Style',
  healthWellness: 'Health and Wellness',
  diyCrafts: 'DIY and Crafts',
  petsAnimalCare: 'Pets and Animal Care',
  carsAutomobiles: 'Cars and Automobiles',
  historyArchaeology: 'History and Archaeology',
  financeInvesting: 'Finance and Investing',
  scienceDiscovery: 'Science and Discovery',
  philosophySpirituality: 'Philosophy and Spirituality',
  volunteeringActivism: 'Volunteering and Activism',
};
