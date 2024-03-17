import { OccupationsInfo } from './types';

export const generateOccupationsInfo = (
  language: string
): OccupationsInfo[] => {
  // Map of country names in different languages
  const occupationNames: Record<string, Record<string, string>> = {
    en: {
      student: 'Student',
      engineer: 'Engineer',
      teacher: 'Teacher',
      medical: 'Medical Field',
      lawyer: 'Lawyer',
      artist: 'Artist',
      writer: 'Writer',
      accountant: 'Accountant',
      entrepreneur: 'Entrepreneur',
      retired: 'Retired',
      it: 'IT',
      construction: 'Construction',
      other: 'Other',
    },
    es: {
      student: 'Estudiante',
      engineer: 'Ingeniero',
      teacher: 'Profesor',
      medical: 'Campo Médico',
      lawyer: 'Abogado',
      artist: 'Artista',
      writer: 'Escritor',
      accountant: 'Contador',
      entrepreneur: 'Emprendedor',
      retired: 'Jubilado',
      it: 'Tecnologías de la Información',
      construction: 'Construcción',
      other: 'Otro',
    },
    de: {
      student: 'Student',
      engineer: 'Ingenieur',
      teacher: 'Lehrer',
      medical: 'Medizinisches Feld',
      lawyer: 'Anwalt',
      artist: 'Künstler',
      writer: 'Schreiber',
      accountant: 'Buchhalter',
      entrepreneur: 'Unternehmer',
      retired: 'In Rente',
      it: 'IT',
      construction: 'Bauwesen',
      other: 'Andere',
    },
    fr: {
      student: 'Étudiant',
      engineer: 'Ingénieur',
      teacher: 'Enseignant',
      medical: 'Domaine Médical',
      lawyer: 'Avocat',
      artist: 'Artiste',
      writer: 'Écrivain',
      accountant: 'Comptable',
      entrepreneur: 'Entrepreneur',
      retired: 'Retraité',
      it: 'Informatique',
      construction: 'Construction',
      other: 'Autre',
    },
    it: {
      student: 'Studente',
      engineer: 'Ingegnere',
      teacher: 'Insegnante',
      medical: 'Campo Medico',
      lawyer: 'Avvocato',
      artist: 'Artista',
      writer: 'Scrittore',
      accountant: 'Contabile',
      entrepreneur: 'Imprenditore',
      retired: 'Pensionato',
      it: 'IT',
      construction: 'Costruzione',
      other: 'Altro',
    },
    pt: {
      student: 'Estudante',
      engineer: 'Engenheiro',
      teacher: 'Professor',
      medical: 'Campo Médico',
      lawyer: 'Advogado',
      artist: 'Artista',
      writer: 'Escritor',
      accountant: 'Contador',
      entrepreneur: 'Empreendedor',
      retired: 'Aposentado',
      it: 'TI',
      construction: 'Construção',
      other: 'Outro',
    },
  };

  const occupations: OccupationsInfo[] = [];

  Object.keys(occupationNames.en).forEach((code) => {
    const name = occupationNames[language]?.[code] || 'Unknown';
    occupations.push({ code, name });
  });

  return occupations;
};
