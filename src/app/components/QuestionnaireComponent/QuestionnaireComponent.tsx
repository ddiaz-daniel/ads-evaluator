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
    const handleNextPage = () => {
        //save the answer
        if (page === 9 || page === 8) {
            const newAnswer: QuestionnaireAnswer = {
                question: questions[page],
                answer: textAreaValue,
            };
            setAnswers([...answers, newAnswer]);
        }
        else {
            const newAnswer: QuestionnaireAnswer = {
                question: questions[page],
                answer: selectedRadioValue,
            };
            setAnswers([...answers, newAnswer]);
        }
        setTextAreaValue('');
        setPage(page + 1);
        //due to the re-rendering of the component the radio button value is not updated 
        //on time so the page needs to be set as 9 to be displayed on 10
        setSelectedRadioValue(page === 9 ? '1' : '3');
        progressiveAnswerUploading();
    };

    const handleBack = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const progressiveAnswerUploading = async () => {
        const id = localStorage.getItem('questionnaire-id') as string;
        await addDataToProile(id, { questionnaireAnswers: answers });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const id = localStorage.getItem('questionnaire-id') as string;
        await addDataToProile(id, { questionnaireAnswers: answers }).then(() => {
            //delete the questionnaire id from the local storage
            localStorage.removeItem('questionnaire-id');
            router.push('/thanks');
        });


    };

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
            }
        };
        getAllUsersData();
    }, []);

    if (!selectedAd) {
        return (
            <div className="flex h-screen w-screen place-content-center items-center">
                <CircularProgress />
            </div>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <form
                onSubmit={handleSubmit}
                className="relative mx-auto h-full min-h-screen max-w-md pt-1"
            >
                {page !== 0 && (
                    <button
                        type="button"
                        className="absolute top-6 left-4 text-2xl z-50"
                        onClick={handleBack}
                    >
                        {'<-'}
                    </button>
                )}

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

                        <label className={`flex flex-row just px-8 pt-1 font-semibold text-sm text-white ${page == 10 ? "justify-evenly" : "justify-between"}`}>
                            <span className="">{t(`option${page + 1}-1`)}</span>
                            <span className=" text-end">{t(`option${page + 1}-2`)}</span>
                        </label>
                        <RadioGroup
                            row
                            aria-rowcount={5}
                            aria-labelledby="demo-form-control-label-placement"
                            name="position"
                            defaultValue="top"
                            sx={{ justifyContent: 'center' }}
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

                <div className="relative flex w-full justify-center">
                    {page < 10 && (
                        <button
                            type="button"
                            onClick={handleNextPage}
                            className="mx-8 w-full rounded bg-secondary p-3 text-center"
                        >
                            {t('continue')}
                        </button>
                    )}
                    {page === 10 && (
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="mx-8 w-full rounded bg-secondary p-3 text-center"
                        >
                            {t('continue')}
                        </button>
                    )}
                </div>
            </form >
        </ThemeProvider >
    );
};

export default QuestionnaireComponent;
