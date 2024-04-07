'use client';
import {
    addDataToProile,
    getAllGeneratedAdsFilteredByInterests,
    getAllUsers,
    interestsNames,
} from '@/app/utils/firebase/functions';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import QuestionComponent from './QuestsionComponent';
import { Ad, QuestionnaireAnswer, TargetedAds } from '@/app/types/types';
import {
    CircularProgress,
    FormControlLabel,
    Radio,
    RadioGroup,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import { useRouter } from '@/app/utils/navigation/navigation';


const QuestionnaireComponent = () => {
    const [page, setPage] = useState(0);
    const [answers, setAnswers] = useState<QuestionnaireAnswer[]>([]);
    const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
    const [selectedRadioValue, setSelectedRadioValue] = useState('3');
    const [textAreaValue, setTextAreaValue] = useState('');
    const [isLoading, setIsLoading] = useState(true);


    const t = useTranslations('questions');
    const router = useRouter();

    const theme = createTheme({
        palette: {
            primary: {
                main: '#544cc9',
            },
        },
    });

    const questions = [
        t('question1'),
        t('question2'),
        t('question3'),
        t('question4'),
        t('question5'),
        t('question6'),
        t('question7'),
        t('question8'),
        t('question9'),
        t('question10'),
        t('question11'),
    ];

    //Radio buttons functions
    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRadioValue(event.target.value);
    };

    //pageing functions
    const handleNextPage = async () => {
        // Create a copy of the current answers
        let newAnswers = [...answers];

        // Create an object to hold the question-answer pair for the current page
        let pageAnswer: QuestionnaireAnswer;

        // Determine the answer based on the page number
        if (page === 9 || page === 8) {
            pageAnswer = {
                question: questions[page],
                answer: textAreaValue,
            };
        } else {
            pageAnswer = {
                question: questions[page],
                answer: selectedRadioValue,
            };
        }

        // Store the answer for the current page at the corresponding index in newAnswers
        newAnswers[page] = pageAnswer;

        // Update state with the new answers
        setAnswers(newAnswers);
        setTextAreaValue('');
        // Increment the page number
        if (page < 11) {
            setPage(page + 1);
        }


        // Due to the re-rendering of the component, the radio button value is not updated 
        // on time so the page needs to be set as 9 to be displayed on 10
        setSelectedRadioValue(page === 9 ? '1' : '3');
        progressiveAnswerUploading();

    };

    const progressiveAnswerUploading = async () => {
        const id = localStorage.getItem('questionnaire-id') as string;
        await addDataToProile(id, { questionnaireAnswers: answers });
    };

    const addingSelectedAdInfoToUser = async (ad: TargetedAds) => {
        const id = localStorage.getItem('questionnaire-id') as string;
        //adding id
        await addDataToProile(id, { adRelatedId: ad.id });
        //adding persona name
        await addDataToProile(id, { adRelatedPerson: ad.ad.persona.name });
    };

    const addingInterestsToUser = async (interest: string) => {
        const id = localStorage.getItem('questionnaire-id') as string;
        await addDataToProile(id, { relatedInterest: interest });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleNextPage();
    };

    useEffect(() => {
        if (page === questions.length) {
            const addAnswersToProfile = async () => {
                const id = localStorage.getItem('questionnaire-id') as string;
                await addDataToProile(id, { questionnaireAnswers: answers }).then(() => {
                    //delete the questionnaire id from the local storage
                    localStorage.removeItem('questionnaire-id');
                    router.push('/thanks');
                });
            };
            addAnswersToProfile();
        }
    }, [page]);

    useEffect(() => {
        //get users data
        const getAllUsersData = async () => {
            const response = await getAllUsers();
            const allUsers = await response;
            const userId = localStorage.getItem('questionnaire-id');

            if (userId) {
                const currentUser = allUsers.find((user) => user.id === userId);
                //check relation between user interests and ads
                const interestRelatedAds: TargetedAds[] =
                    await getAllGeneratedAdsFilteredByInterests(
                        currentUser?.hobbies || []
                    );

                //compare the current user interests with the interest of all the other users
                // Count coincidences for each interest among all users
                const currentUserInterests = new Set(currentUser?.hobbies);

                const interestCoincidences: { interest: string; quantity: number; }[] =
                    Array.from(currentUserInterests).map((interest) => ({
                        interest,
                        quantity: 0,
                    }));

                allUsers.forEach((user) => {
                    currentUser?.hobbies.forEach((interest) => {
                        if (user.relatedInterest === interest) {
                            const matchedInterest = interestCoincidences.find(
                                (item) => item.interest === interest
                            );
                            if (matchedInterest) {
                                matchedInterest.quantity++;
                            }
                        }
                    });
                });

                //take the interests with the least coincidences
                const lessCoincidences = interestCoincidences
                    .sort((a, b) => a.quantity - b.quantity)
                    .slice(0, 3);

                //get the ads that match the interests
                const leastUsedAds = interestRelatedAds.filter(
                    (ad) =>
                        interestsNames[lessCoincidences[0].interest] === ad.relatedInterest
                );

                //now check the number of coincidences between the leastUsedAds ids and the users ids
                const leastUsedAdsAndAllUsersIdComparison = leastUsedAds.map((ad) => {
                    const coincidences = allUsers.filter(
                        (user) => user.adRelatedId === ad.id
                    );
                    return { ad, coincidences };
                });

                //sort the ads by the number of coincidences from the least to the most
                const sortedAds = leastUsedAdsAndAllUsersIdComparison.sort(
                    (a, b) => a.coincidences.length - b.coincidences.length
                );
                //selectiong the least common ad
                setSelectedAd(sortedAds[0].ad.ad);
                addingSelectedAdInfoToUser(sortedAds[0].ad);
                addingInterestsToUser(interestsNames[lessCoincidences[0].interest]);
            }
        };
        getAllUsersData();
    }, []);

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
            localStorage.clear();
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    caches.delete(cacheName); // Clear all caches
                });
            });
            router.push('/');

        }, 5000);

        return () => clearTimeout(loadingTimeout);
    }, [isLoading]);


    if (!selectedAd) {
        setIsLoading(true);
        return (
            <div className="flex h-dvh w-dvw place-content-center items-center">
                <CircularProgress />
            </div>
        );
    }

    if (page > 10) {
        setIsLoading(true);
        return (
            <div className="flex h-dvh w-dvw place-content-center items-center">
                <CircularProgress />
            </div>
        );
    }




    return (
        <ThemeProvider theme={theme}>
            <form
                className="relative mx-auto max-w-md pt-1"
            >

                <QuestionComponent
                    page={page}
                    question={questions[page]}
                    pageNumber={page}
                    selectedAd={selectedAd}
                />
                {
                    (page === 8 || page === 9) ? (
                        <div className='w-full px-8'>
                            <textarea
                                className="w-full p-2 bg-white text-black"
                                placeholder={t('write')}
                                value={textAreaValue}
                                onChange={(e) => setTextAreaValue(e.target.value)}
                            ></textarea>
                        </div>

                    ) : <>

                        <label className={`flex flex-row just px-8 pt-1 font-semibold text-sm dark:text-white text-white ${page == 10 ? "justify-evenly px-28" : "justify-between"}`}>
                            <span className="">{t(`option${page + 1}-1`)}</span>
                            <span className=" text-end">{t(`option${page + 1}-2`)}</span>
                        </label>
                        <RadioGroup
                            row
                            aria-rowcount={5}
                            aria-labelledby="demo-form-control-label-placement"
                            name="position"
                            defaultValue="top"
                            sx={{ justifyContent: 'center', color: '#ffffff' }}
                            onChange={handleRadioChange}
                            value={selectedRadioValue}
                        >
                            <FormControlLabel
                                value="1"
                                control={<Radio sx={{ color: '#ffffff' }} />}
                                label={page === 10 ? '' : '1'}
                                labelPlacement="top"
                                sx={{ margin: '0 4px 0 4px' }}
                            />
                            {page !== 10 &&
                                <>
                                    <FormControlLabel
                                        value="2"
                                        control={<Radio sx={{ color: '#ffffff' }} />}
                                        label={page === 10 ? '' : '2'}
                                        hidden={page === 10}
                                        labelPlacement="top"
                                        sx={{ margin: '0 4px 0 4px' }}

                                    />
                                    <FormControlLabel
                                        value="3"
                                        control={<Radio sx={{ color: '#ffffff' }} />}
                                        label={page === 10 ? '' : '3'}
                                        hidden={page === 10}
                                        labelPlacement="top"
                                        sx={{ margin: '0 4px 0 4px' }}

                                    />
                                    <FormControlLabel
                                        value="4"
                                        control={<Radio sx={{ color: '#ffffff' }} />}
                                        label={page === 10 ? '' : '4'}
                                        hidden={page === 10}
                                        labelPlacement="top"
                                        sx={{ margin: '0 4px 0 4px' }}

                                    />
                                </>
                            }
                            <FormControlLabel
                                value="5"
                                control={<Radio sx={{ color: '#ffffff' }} />}
                                label={page === 10 ? '' : '5'}
                                labelPlacement="top"
                                sx={{ margin: '0 4px 0 4px' }}

                            />
                        </RadioGroup>
                    </>
                }

                <div className="relative flex w-full justify-center flex-row space-x-2 px-4">
                    {page < 10 && (
                        <>
                            <button
                                type="button"
                                onClick={handleNextPage}
                                className="ml-8 mr-4 w-4/5 rounded bg-secondary p-3 text-center"
                            >
                                {t('continue')}
                            </button>
                            <h1 className="w-1/5 h-10 justify-center flex bg-white rounded-full text-black items-center self-center">
                                <span className="text-base">{page + 1}</span>
                                <span className=" text-sm">|11</span>
                            </h1>
                        </>
                    )}
                    {page === 10 && (
                        <>
                            <button
                                type="button"
                                onClick={handleNextPage}
                                className="ml-8 mr-4 w-4/5  rounded bg-secondary p-3 text-center"
                            >
                                {t('continue')}
                            </button>
                            <h1 className="w-1/5 h-10 justify-center flex bg-white rounded-full text-black items-center self-center">
                                <span className="text-base">{page + 1}</span>
                                <span className=" text-sm">|11</span>
                            </h1>
                        </>
                    )}
                </div>
            </form >
        </ThemeProvider >
    );
};

export default QuestionnaireComponent;
