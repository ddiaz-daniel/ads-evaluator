import { User } from '@/app/types/types';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, Box, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getGeneratedAdById } from '@/app/utils/firebase/functions';
import Image from 'next/image';

interface AdImage {
    persona: string;
    image: string;
}

const OpenQuestionsAnswers: React.FC<{ filteredUsers: User[]; }> = ({ filteredUsers }) => {
    const [adImages, setAdImages] = useState<{ [key: string]: AdImage[]; }>({});

    useEffect(() => {
        // Extract unique adRelatedIds
        const adRelatedIds = Array.from(new Set(filteredUsers.map(user => user.adRelatedId).filter(Boolean)));

        // Fetch images for each adRelatedId
        const fetchImages = async () => {
            const imagePromises = adRelatedIds.map(async id => {
                const ads = await getGeneratedAdById(id);
                return {
                    id,
                    images: ads?.map(ad => ({ persona: ad.persona.name, image: ad.images[0] }))
                };
            });

            const images = await Promise.all(imagePromises);
            if (!images) return;
            const imageMap = images.reduce((acc, { id, images }) => {
                if (images) acc[id] = images;
                return acc;
            }, {} as { [key: string]: AdImage[]; });

            setAdImages(imageMap);
        };

        fetchImages();
    }, [filteredUsers]);

    const getOpenQuestionAnswers = (user: User, questionIndex: number) => {
        if (!user.questionnaireAnswers) return null;
        return user.questionnaireAnswers[questionIndex]?.answer || null;
    };

    const filteredUsersWithAnswers = filteredUsers.filter(user => {
        const firstAnswer = getOpenQuestionAnswers(user, 8);
        const lastAnswer = getOpenQuestionAnswers(user, 9);
        return firstAnswer || lastAnswer;
    });

    const renderAnswersForImage = (adRelatedId: string, persona: string) => {
        const usersWithSameAdAndPersona = filteredUsersWithAnswers.filter(user => user.adRelatedId === adRelatedId && user.adRelatedPerson === persona);

        if (usersWithSameAdAndPersona.length === 0) return null;

        return (
            <>
                <TableRow>
                    <TableCell style={{ width: '50%' }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            What specific element of the ad influenced your decision to interact or not interact with it?
                        </Typography>
                    </TableCell>
                    <TableCell style={{ width: '50%' }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Did this ad evoke any emotional responses from you (e.g., happiness, excitement, trust)?
                        </Typography>
                    </TableCell>
                </TableRow>
                {usersWithSameAdAndPersona.map((user, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            {getOpenQuestionAnswers(user, 8)}
                        </TableCell>
                        <TableCell>
                            {getOpenQuestionAnswers(user, 9)}
                        </TableCell>
                    </TableRow>
                ))}
            </>
        );
    };

    return (
        <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
            <Typography variant="h5" gutterBottom>Open Questions and Related Images</Typography>
            <Table style={{ width: '100%' }}>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ width: '25%' }}>Ad Image</TableCell>
                        <TableCell style={{ width: '37.5%' }}>Q1</TableCell>
                        <TableCell style={{ width: '37.5%' }}>Q2</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(adImages).map((adRelatedId, adIndex) => (
                        adImages[adRelatedId]?.map((adImage, imageIndex) => {
                            const answers = renderAnswersForImage(adRelatedId, adImage.persona);
                            if (!answers) return null; // Skip rendering this row if no answers
                            return (
                                <TableRow key={`${adIndex}-${imageIndex}`}>
                                    <TableCell style={{ width: '25%' }}>
                                        <Box mb={2} className="flex flex-col place-items-center">
                                            <Image
                                                src={adImage.image}
                                                alt={`Ad related to ${adRelatedId} - ${adImage.persona}`}
                                                width={150}
                                                height={150}
                                                style={{ maxWidth: '100%' }}
                                            />
                                            <Typography variant="body2" align="center">{adImage.persona}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell colSpan={2} style={{ width: '75%' }}>
                                        <Table style={{ width: '100%' }}>
                                            <TableBody>
                                                {answers}
                                            </TableBody>
                                        </Table>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default OpenQuestionsAnswers;
