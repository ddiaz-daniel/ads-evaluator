import { User } from '@/app/types/types';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface GroupedData {
    [id: string]: { real: number; ai: number; };
}

const FirstSectionAnswers: React.FC<{ filteredUsers: User[]; }> = ({ filteredUsers }) => {
    const getAIRealGroupedById = () => {
        const groupedById: GroupedData = {};

        filteredUsers.forEach(user => {
            if (user.aiOrReal) {
                user.aiOrReal.forEach(answer => {
                    const id = answer.id;
                    if (!groupedById[id]) {
                        groupedById[id] = { real: 0, ai: 0 };
                    }
                    if (answer.answer === "real") {
                        groupedById[id].real++;
                    } else if (answer.answer === "ai") {
                        groupedById[id].ai++;
                    }
                });
            }
        });
        return groupedById;
    };

    const renderFilteredUsersTable = () => {
        const groupedById = getAIRealGroupedById();

        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Ad Image</TableCell>
                        <TableCell>Answer</TableCell>
                        <TableCell>Real (%)</TableCell>
                        <TableCell>AI (%)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(groupedById).map(([id, counts]) => (
                        <TableRow key={id}>
                            <TableCell>
                                <img src={`/images/${id}.jpg`} alt={`Ad ${id}`} style={{ width: 150, height: 150 }} />
                            </TableCell>
                            <TableCell>
                                {id.startsWith('100') ? 'Real Ad' : 'AI Generated Ad'}
                            </TableCell>
                            <TableCell className={(id.startsWith('100') && (counts.real / (counts.real + counts.ai) > 0.5)) ?
                                " text-green-500" : (!id.startsWith('100') && (counts.ai / (counts.real + counts.ai) < 0.5)) ?
                                    "text-red-500" : "text-black"}>
                                {(counts.real / (counts.real + counts.ai) * 100).toFixed(2)}
                            </TableCell>
                            <TableCell className={(!id.startsWith('100') && (counts.ai / (counts.real + counts.ai) > 0.5)) ?
                                "text-green-500" : (id.startsWith('100') && (counts.real / (counts.real + counts.ai) < 0.5)) ?
                                    "text-red-500" : "text-black"}
                            >{(counts.ai / (counts.real + counts.ai) * 100).toFixed(2)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    return (
        <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
            <Typography variant="h5" gutterBottom>Second part - Real or AI set of questions</Typography>
            {renderFilteredUsersTable()}
        </Paper>
    );
};

export default FirstSectionAnswers;
