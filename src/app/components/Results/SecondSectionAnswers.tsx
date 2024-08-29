import { User } from '@/app/types/types';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, Tabs, Tab } from '@mui/material';
import { Chart } from 'react-chartjs-2';
import * as math from 'mathjs';
import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { getGeneratedAdById } from '@/app/utils/firebase/functions';
import Image from 'next/image';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

interface GroupedData {
    [id: string]: { [persona: string]: User[]; };
}

interface Stats {
    mean: number;
    stdDev: number;
    distribution: { [key: string]: number; };
}

interface AdImage {
    persona: string;
    image: string;
    interests: string[];
}

const SecondSectionAnswers: React.FC<{ filteredUsers: User[]; }> = ({ filteredUsers }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [filterAdId, setFilterAdId] = useState<string>('');
    const [filterPersona, setFilterPersona] = useState<string>('');
    const [filterInterest, setFilterInterest] = useState<string>('');
    const [filteredData, setFilteredData] = useState<User[]>(filteredUsers);
    const [adImages, setAdImages] = useState<{ [key: string]: AdImage[]; }>({});
    const [uniqueAdIds, setUniqueAdIds] = useState<string[]>([]);
    const [uniquePersonas, setUniquePersonas] = useState<string[]>([]);
    const [uniqueInterests, setUniqueInterests] = useState<string[]>([]);

    useEffect(() => {
        const adRelatedIds = Array.from(new Set(filteredUsers.map(user => user.adRelatedId).filter(Boolean)));
        const personas = Array.from(new Set(filteredUsers.map(user => user.relatedPersona).filter(Boolean)));
        const interests = Array.from(new Set(filteredUsers.map(user => user.relatedInterest).filter(Boolean)));

        setUniqueAdIds(adRelatedIds);
        setUniquePersonas(personas);
        setUniqueInterests(interests);

        const fetchImages = async () => {
            const imagePromises = adRelatedIds.map(async id => {
                const ads = await getGeneratedAdById(id);
                return {
                    id,
                    images: ads?.map(ad => ({ persona: ad.persona.name, image: ad.images[0], interests: ad.persona.personality.interests }))
                };
            });

            const images = await Promise.all(imagePromises);
            if (!images) return;
            const imageMap = images.reduce((acc, { id, images }) => {
                if (images)
                    acc[id] = images;
                return acc;
            }, {} as { [key: string]: AdImage[]; });
            setAdImages(imageMap);
        };

        fetchImages();
    }, [filteredUsers]);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleFilterChange = (e: React.ChangeEvent<{ value: unknown; name?: string; }>) => {
        const { name, value } = e.target;
        if (name === 'adId') {
            setFilterAdId(value as string);
            setUniquePersonas(
                value
                    ? adImages[value as string].map(img => img.persona)
                    : Array.from(new Set(filteredUsers.map(user => user.relatedPersona).filter(Boolean)))
            );
            setFilterPersona('');
        }
        if (name === 'persona') setFilterPersona(value as string);
        if (name === 'interest') setFilterInterest(value as string);
    };

    const handleFilterApply = () => {
        setFilteredData(filteredUsers.filter(user => {
            return (
                (!filterAdId || user.adRelatedId === filterAdId) &&
                (!filterPersona || user.relatedPersona === filterPersona || user.adRelatedPerson === filterPersona) &&
                (!filterInterest || user.relatedInterest === filterInterest)
            );
        }));
    };

    const calculateStats = (distribution: number[]): Stats => {
        if (distribution.length === 0) {
            return {
                mean: 0,
                stdDev: 0,
                distribution: {}
            };
        }

        let expandedAnswers = distribution.flatMap((count, index) => Array(count).fill(index + 1));
        // if expandedANswers is empty just set it as an array of 0
        let mean = 0;
        let stdDev = 0;
        if (expandedAnswers.length > 0) {
            mean = math.mean(expandedAnswers);
            stdDev = math.std(expandedAnswers) as unknown as number;
        }


        return {
            mean,
            stdDev,
            distribution: distribution.reduce((acc, count, index) => {
                acc[index + 1] = count;
                return acc;
            }, {} as { [key: string]: number; })
        };
    };

    const listOfQuestionsInEnglish = [
        "How clear is the message of this ad to you (image & text)?",
        "How credible and trustworthy does this ad appear to you?",
        "How visually appealing is this ad?",
        "Did you find the ad relevant to your interests, lifestyle, or needs?",
        "How well did the ad capture your attention?",
        "How well do you think the ad matched your interests and preferences?",
        "Would you consider interacting (e.g., click, purchase) with the ad you saw?",
        "How would you rate the overall quality of the ad?",
        "What specific element of the ad influenced your decision to interact or not interact with it? (optional)",
        "Did this ad evoke any emotional responses from you? (e.g., happiness, excitement, trust)? (optional)",
        "Do you think it was an AI-generated ad?"
    ];

    const getQuantitativeAnalysis = (data: User[]): { [id: string]: { [persona: string]: { [question: string]: Stats; }; }; } => {
        const groupedStats: { [id: string]: { [persona: string]: { [question: string]: Stats; }; }; } = {};

        data.forEach(user => {
            if (!user.questionnaireAnswers || user.adRelatedId == undefined) return;

            const adId = user.adRelatedId;
            const persona = user.adRelatedPerson;

            if (!groupedStats[adId]) groupedStats[adId] = {};
            if (!groupedStats[adId][persona]) groupedStats[adId][persona] = {};

            let questionNumber = 0;
            user.questionnaireAnswers.forEach(answer => {
                //skip question 9 and 10
                if (questionNumber === 8 || questionNumber === 9) {
                    questionNumber++;
                    return;
                }

                const question = listOfQuestionsInEnglish[questionNumber];
                const answerValue = parseInt(answer.answer, 10);

                if (!groupedStats[adId][persona][question]) {
                    groupedStats[adId][persona][question] = {
                        mean: 0,
                        stdDev: 0,
                        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
                    };
                }

                if (!isNaN(answerValue) && typeof answerValue === 'number') {
                    groupedStats[adId][persona][question].distribution[answerValue] = (groupedStats[adId][persona][question].distribution[answerValue] || 0) + 1;
                }

                questionNumber++;
            });
        });

        Object.keys(groupedStats).forEach(adId => {
            Object.keys(groupedStats[adId]).forEach(persona => {
                Object.keys(groupedStats[adId][persona]).forEach(question => {
                    const stats = calculateStats(Object.values(groupedStats[adId][persona][question].distribution));
                    groupedStats[adId][persona][question] = stats;
                });
            });
        });

        return groupedStats;
    };

    const renderCompleteDataTable = (data: User[]) => {
        const quantitativeAnalysis = getQuantitativeAnalysis(data);
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Ad ID / Persona</TableCell>
                        {listOfQuestionsInEnglish.slice(0, -1).map((question, index) => (
                            //kip 8 and 9 
                            index === 8 || index === 9 ? null :
                                <TableCell key={index}>{question}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(quantitativeAnalysis).map((adId, index) => (
                        Object.keys(quantitativeAnalysis[adId]).map(persona => (
                            persona !== "undefined" ? (
                                <TableRow key={`${adId}-${persona}`}>
                                    <TableCell>
                                        <Image
                                            src={adImages[adId]?.find(img => img.persona === persona)?.image || ''}
                                            alt={`Ad related to ${persona}`}
                                            width={50}
                                            height={50}
                                        />
                                        <Typography variant="body2">Set #{index}</Typography>
                                        <Typography variant="body2">{adImages[adId]?.find(img => img.persona === persona)?.persona}</Typography>
                                    </TableCell>
                                    {listOfQuestionsInEnglish.slice(0, -1).map((question, questionIndex) => (
                                        questionIndex === 8 || questionIndex === 9 ? null :
                                            <TableCell key={questionIndex}>
                                                {quantitativeAnalysis[adId][persona][question]?.mean.toFixed(2)} / {quantitativeAnalysis[adId][persona][question]?.stdDev.toFixed(2)}
                                            </TableCell>
                                    ))}
                                </TableRow>) : null
                        ))
                    ))}
                </TableBody>
            </Table>
        );
    };

    return (
        <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
            <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
                <Tab label="Filtered View" />
                <Tab label="Complete Data View" />
            </Tabs>

            {activeTab === 0 && (
                <div>
                    <Typography variant="h5" gutterBottom>Third part - Select the set and visualize the answer distribution</Typography>
                    <Box display="flex" alignItems="center" mb={3}>
                        <FormControl variant="outlined" sx={{ mr: 2, minWidth: 120 }}>
                            <InputLabel>Ad ID</InputLabel>
                            <Select
                                value={filterAdId}
                                onChange={(e) => handleFilterChange(e as React.ChangeEvent<{ value: unknown; name?: string; }>)}
                                label="Ad ID"
                                name="adId"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {uniqueAdIds.map(id => (
                                    <MenuItem key={id} value={id}>
                                        {id}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" sx={{ mr: 2, minWidth: 120 }}>
                            <InputLabel>Persona</InputLabel>
                            <Select
                                value={filterPersona}
                                onChange={(e) => handleFilterChange(e as React.ChangeEvent<{ value: unknown; name?: string; }>)}
                                label="Persona"
                                name="persona"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {uniquePersonas.map(persona => (
                                    <MenuItem key={persona} value={persona}>
                                        {persona}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="outlined" sx={{ mr: 2, minWidth: 120 }}>
                            <InputLabel>Interest</InputLabel>
                            <Select
                                value={filterInterest}
                                onChange={(e) => handleFilterChange(e as React.ChangeEvent<{ value: unknown; name?: string; }>)}
                                label="Interest"
                                name="interest"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {uniqueInterests.map(interest => (
                                    <MenuItem key={interest} value={interest}>
                                        {interest}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <button className='bg-[#534ec4] text-white p-4 rounded-md shadow-lg hover:bg-blue-800' onClick={handleFilterApply}>
                            Apply Filter
                        </button>
                    </Box>
                    {filterAdId && adImages[filterAdId] && (
                        <Box mb={3}>
                            <Typography variant="h6">Ad Related Images</Typography>
                            <Box display="flex" flexWrap="wrap">
                                {adImages[filterAdId].map((adImage, index) => (
                                    <Box key={index} mr={2} mb={2}>
                                        <Image
                                            src={adImage.image}
                                            alt={`Ad related to ${filterAdId} - ${adImage.persona}`}
                                            width={200}
                                            height={200}
                                        />
                                        <Typography variant="body2" align="center">{adImage.persona}</Typography>
                                        {
                                            adImage.interests.map((interest, index) => (
                                                <Typography key={index} variant="body2" align="center" color={"#AAAAAA"}>{interest}</Typography>
                                            ))
                                        }
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                    <Typography variant="h5" gutterBottom>Quantitative Analysis</Typography>
                    {renderCompleteDataTable(filteredData)}
                </div>
            )}

            {activeTab === 1 && (
                <div>
                    <Typography variant="h5" gutterBottom>Complete Data View</Typography>
                    {renderCompleteDataTable(filteredUsers)}
                </div>
            )}
        </Paper>
    );
};

export default SecondSectionAnswers;
