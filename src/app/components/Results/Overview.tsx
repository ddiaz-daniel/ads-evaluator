import React, { useEffect, useState } from 'react';
import { Paper, Typography, Grid } from '@mui/material'; // Importing Material-UI components
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, PieChart, Pie, Cell } from 'recharts'; // Importing Recharts components
import { User } from '@/app/types/types';
import Images from 'next/image';

interface OverviewProps {
    users: User[];
}

const Overview: React.FC<OverviewProps> = ({ users }) => {
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalCountries, setTotalCountries] = useState<number>(0);
    const [countryEntries, setCountryEntries] = useState<{ [key: string]: number; }>({});
    const [ageRangeData, setAgeRangeData] = useState<{ ageRange: string; count: number; }[]>([]);
    const [hobbiesData, setHobbiesData] = useState<{ hobby: string; count: number; }[]>([]);
    const [genderData, setGenderData] = useState<{ gender: string; count: number; }[]>([]);
    const [occupationData, setOccupationData] = useState<{ occupation: string; count: number; }[]>([]);

    const genderColors = ['#004B95', '#38812F', '#005F60', '#C46100', '#F0AB00'];
    const ageRangeColors = ['#A30000', '#EF9234', '#F6D173', '#06C', '#7CC674'];

    useEffect(() => {
        // Calculate total number of users
        setTotalUsers(users.length);

        // Calculate total number of countries
        const countries = users.map(user => user.country);
        const uniqueCountries = new Set(countries);
        setTotalCountries(uniqueCountries.size);

        // Calculate entries by country
        const entriesByCountry: { [key: string]: number; } = {};
        countries.forEach(country => {
            entriesByCountry[country] = (entriesByCountry[country] || 0) + 1;
        });
        setCountryEntries(entriesByCountry);

        // Calculate age range totals
        const ageRangeCounts: { [key: string]: number; } = {};
        users.forEach(user => {
            ageRangeCounts[user.ageRange] = (ageRangeCounts[user.ageRange] || 0) + 1;
        });
        const ageRangeChartData = Object.keys(ageRangeCounts).map(ageRange => ({
            ageRange,
            count: ageRangeCounts[ageRange],
        }));
        setAgeRangeData(ageRangeChartData);

        // Calculate hobbies totals
        const allHobbies = users.flatMap(user => user.hobbies);
        const hobbyCounts: { [key: string]: number; } = {};
        allHobbies.forEach(hobby => {
            hobbyCounts[hobby] = (hobbyCounts[hobby] || 0) + 1;
        });
        const hobbiesChartData = Object.keys(hobbyCounts).map(hobby => ({
            hobby,
            count: hobbyCounts[hobby],
        }));
        setHobbiesData(hobbiesChartData);

        // Calculate gender distribution
        const genderCounts: { [key: string]: number; } = {};
        users.forEach(user => {
            genderCounts[user.gender] = (genderCounts[user.gender] || 0) + 1;
        });
        const genderChartData = Object.keys(genderCounts).map(gender => ({
            gender,
            count: genderCounts[gender],
        }));
        setGenderData(genderChartData);

        // Calculate occupation distribution
        const occupationCounts: { [key: string]: number; } = {};
        users.forEach(user => {
            occupationCounts[user.occupation] = (occupationCounts[user.occupation] || 0) + 1;
        });
        const occupationChartData = Object.keys(occupationCounts).map(occupation => ({
            occupation,
            count: occupationCounts[occupation],
        }));
        setOccupationData(occupationChartData);
    }, [users]);

    return (
        <div className='py-8'>
            <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
                <Typography variant="h5" gutterBottom>Overview</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography>Total Users: </Typography>
                        <Typography variant="h1">{totalUsers}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography>Total Countries:</Typography>
                        <Typography variant="h3">{totalCountries}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        <Typography>Entries by Country:</Typography>
                        <Grid container spacing={1}>
                            {Object.entries(countryEntries).map(([country, count]) => (
                                <Grid item key={country} xs={2} sm={2} md={2}>
                                    <Images width={100}
                                        height={100}
                                        loading="lazy"
                                        src={`https://flagcdn.com/w40/${country.toLowerCase()}.png`} alt={country} style={{ width: '30px', height: 'auto' }} />
                                    <Typography>{count}</Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
                <Grid container spacing={2}>
                    <Grid item xs={6} sm={6} md={6}>
                        <Typography variant="h5" gutterBottom>Gender Distribution</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    dataKey="count"
                                    nameKey="gender"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {genderData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={genderColors[index % genderColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend align="right" verticalAlign="middle" layout="vertical" />
                            </PieChart>
                        </ResponsiveContainer>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6}>
                        <Typography variant="h5" gutterBottom>Age Range Distribution</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={ageRangeData}
                                    dataKey="count"
                                    nameKey="ageRange"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {ageRangeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={ageRangeColors[index % ageRangeColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend align="right" verticalAlign="middle" layout="vertical" />
                            </PieChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
                <Typography variant="h5" gutterBottom>Occupation Distribution</Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={occupationData} margin={{ top: 15, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="occupation" angle={-45} textAnchor="end" />
                        <YAxis />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="count" fill="#F4C145" />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>

            <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
                <Typography variant="h5" gutterBottom>Hobbies Distribution</Typography>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={hobbiesData} margin={{ top: 15, right: 30, left: 20, bottom: 95 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hobby" angle={-45} textAnchor="end">
                        </XAxis>
                        <YAxis />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="count" fill="#519DE9" />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>

        </div>
    );
};

export default Overview;
