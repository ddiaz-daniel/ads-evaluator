import { User } from '@/app/types/types';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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
    [id: string]: { real: number; ai: number; };
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
    const [filterAdId, setFilterAdId] = useState<string>('');
    const [filterPersona, setFilterPersona] = useState<string>('');
    const [filterInterest, setFilterInterest] = useState<string>('');
    const [filteredData, setFilteredData] = useState<User[]>(filteredUsers);
    const [adImages, setAdImages] = useState<{ [key: string]: AdImage[]; }>({});
    const [uniqueAdIds, setUniqueAdIds] = useState<string[]>([]);
    const [uniquePersonas, setUniquePersonas] = useState<string[]>([]);
    const [uniqueInterests, setUniqueInterests] = useState<string[]>([]);

    useEffect(() => {
        // Extract unique adRelatedIds, relatedPersonas, and relatedInterests
        const adRelatedIds = Array.from(new Set(filteredUsers.map(user => user.adRelatedId).filter(Boolean)));
        const personas = Array.from(new Set(filteredUsers.map(user => user.relatedPersona).filter(Boolean)));
        const interests = Array.from(new Set(filteredUsers.map(user => user.relatedInterest).filter(Boolean)));

        setUniqueAdIds(adRelatedIds);
        setUniquePersonas(personas);
        setUniqueInterests(interests);

        // Fetch images for each adRelatedId
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

    const handleFilterChange = (e: React.ChangeEvent<{ value: unknown; name?: string; }>) => {
        const { name, value } = e.target;
        if (name === 'adId') {
            setFilterAdId(value as string);
            // Update the persona filter options based on the selected ad
            setUniquePersonas(
                value
                    ? adImages[value as string].map(img => img.persona)
                    : Array.from(new Set(filteredUsers.map(user => user.relatedPersona).filter(Boolean)))
            );
            setFilterPersona(''); // Reset persona filter when adId changes
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
        const expandedAnswers = distribution.flatMap((count, index) => Array(count).fill(index + 1));
        const mean = math.mean(expandedAnswers);
        const stdDev = math.std(expandedAnswers) as unknown as number;

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

    const getQuantitativeAnalysis = (data: User[]) => {
        const questionStats: { [question: string]: Stats; } = {};

        data.forEach(user => {
            if (!user.questionnaireAnswers) return;

            let questionNumber = 0;
            user.questionnaireAnswers.forEach(answer => {
                const question = listOfQuestionsInEnglish[questionNumber];
                const answerValue = parseInt(answer.answer, 10);

                if (question === "Do you think it was an AI-generated ad?") {
                    const yesNoAnswer = answerValue === 1 ? "No" : answerValue === 5 ? "Yes" : undefined;
                    if (yesNoAnswer) {
                        if (!questionStats[question]) {
                            questionStats[question] = { mean: 0, stdDev: 0, distribution: { Yes: 0, No: 0 } };
                        }
                        questionStats[question].distribution[yesNoAnswer] = (questionStats[question].distribution[yesNoAnswer] || 0) + 1;
                    }
                } else {
                    if (!isNaN(answerValue) && typeof answerValue === 'number') {
                        if (!questionStats[question]) {
                            questionStats[question] = { mean: 0, stdDev: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
                        }
                        questionStats[question].distribution[answerValue] = (questionStats[question].distribution[answerValue] || 0) + 1;
                    }
                }
                questionNumber++;
            });
        });

        Object.keys(questionStats).forEach(question => {
            const answers = Object.values(questionStats[question].distribution);
            const stats = calculateStats(answers);
            questionStats[question] = stats;
        });

        return questionStats;
    };

    const getYesNoAnalysis = (data: User[]) => {
        const yesNoStats = { yes: 0, no: 0 };

        data.forEach(user => {
            if (!user.questionnaireAnswers) return;
            const answerValue = parseInt(user.questionnaireAnswers[10]?.answer, 10);

            if (!isNaN(answerValue) && typeof answerValue === 'number') {
                if (answerValue === 1) {
                    yesNoStats.no++;
                } else if (answerValue === 5) {
                    yesNoStats.yes++;
                }
            }
        });

        return yesNoStats;
    };

    const renderYesNoChart = (data: User[]) => {
        const yesNoStats = getYesNoAnalysis(data);

        const dataChart = {
            labels: ['No', 'Yes'],
            datasets: [
                {
                    label: 'Responses',
                    data: [yesNoStats.no, yesNoStats.yes],
                    backgroundColor: ['rgba(255,99,132,0.6)', 'rgba(75,192,192,0.6)'],
                    borderColor: ['rgba(255,99,132,1)', 'rgba(75,192,192,1)'],
                    borderWidth: 1,
                },
            ],
        };
    };

    const renderQuantitativeAnalysisTable = (data: User[]) => {
        const quantitativeAnalysis = getQuantitativeAnalysis(data);
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Question</TableCell>
                        <TableCell>Mean</TableCell>
                        <TableCell>Standard Deviation</TableCell>
                        <TableCell>Distribution</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(quantitativeAnalysis).map(question => (
                        <TableRow key={question}>
                            <TableCell>{question}</TableCell>
                            <TableCell>{quantitativeAnalysis[question].mean.toFixed(2)}</TableCell>
                            <TableCell>{quantitativeAnalysis[question].stdDev.toFixed(2)}</TableCell>
                            <TableCell>{JSON.stringify(quantitativeAnalysis[question].distribution)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    const renderQuantitativeAnalysisCharts = (data: User[]) => {
        const quantitativeAnalysis = getQuantitativeAnalysis(data);

        return (
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 3,
                }}
            >
                {Object.keys(quantitativeAnalysis).map(question => {
                    const stats = quantitativeAnalysis[question];
                    const labels = Object.keys(stats.distribution).map(label => label.toString());
                    const distributionData = labels.map(label => stats.distribution[parseInt(label, 10)]);
                    const meanData = new Array(labels.length).fill(stats.mean);
                    const stdDevData = new Array(labels.length).fill(stats.stdDev);

                    const data = {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Distribution',
                                data: distributionData,
                                backgroundColor: 'rgba(75,192,192,0.4)',
                                borderColor: 'rgba(75,192,192,1)',
                                borderWidth: 1,
                                yAxisID: 'y',
                                type: 'bar' as const,
                            },
                        ],
                    };

                    const options = {
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                        type: 'bar' as const, // Set the overall chart type to 'bar'
                    };

                    return (
                        <div key={question} style={{ marginBottom: '20px' }}>
                            <Typography variant="h6" gutterBottom>{question}</Typography>
                            <Chart type='bar' data={data} options={options} />
                        </div>
                    );
                })}
            </Box>
        );
    };


    return (
        <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
            <Typography variant="h5" gutterBottom>Third part - Select the set and visualize the answer distribution</Typography>
            <Box display="flex" alignItems="center" mb={3}>
                <FormControl variant="outlined" sx={{ mr: 2, minWidth: 120 }}>
                    <InputLabel>Ad ID</InputLabel>
                    <Select
                        value={filterAdId}
                        onChange={handleFilterChange}
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
                        onChange={handleFilterChange}
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
                        onChange={handleFilterChange}
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
                                    //show the hobbies related to this persona
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
            {renderQuantitativeAnalysisTable(filteredData)}
            <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
                {renderQuantitativeAnalysisCharts(filteredData)}
            </Paper>

        </Paper>
    );
};

export default SecondSectionAnswers;
