import React, { useEffect, useState } from 'react';
import { Paper, Typography, Divider, FormControl, InputLabel, Select, MenuItem, TextField, Button, FormGroup } from '@mui/material'; // Importing Material-UI components
import { AgeRange, GenderOptions, HobbiesInfo, User } from '@/app/types/types';
import { FilterOptions } from './ResultsPage';
import { generateHobbiesInfo } from '@/app/types/hobbies';

interface SidebarProps {
    allUsers: User[];
    filteredUsers: User[];
    setFilteredUsers: React.Dispatch<React.SetStateAction<User[]>>;
    filterOptions: FilterOptions;
    setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
}

const Sidebar: React.FC<SidebarProps> = ({ allUsers, filteredUsers, setFilteredUsers, filterOptions, setFilterOptions }) => {
    const [listOfHobbies, setListOfHobbies] = useState<HobbiesInfo[]>([]);
    const [uniqueCountries, setUniqueCountries] = useState<string[]>([]);

    useEffect(() => {
        // Filter users based on filterOptions
        const filtered = allUsers.filter(user => {
            if (filterOptions.age && !filterOptions.age.includes(user.ageRange)) {
                return false;
            }
            if (filterOptions.country && !filterOptions.country.includes(user.country)) {
                return false;
            }
            if (filterOptions.gender && !filterOptions.gender.includes(user.gender as GenderOptions)) {
                return false;
            }
            if (filterOptions.hobbies.length > 0 && !user.hobbies?.some(hobby => filterOptions.hobbies.map(h => h.code).includes(hobby))) {
                return false;
            }
            return true;
        });
        setFilteredUsers(filtered);
    }, [allUsers, filterOptions]);

    useEffect(() => {
        // Extracting unique countries from allUsers
        const countries = Array.from(new Set(allUsers.map(user => user.country)));
        setUniqueCountries(countries);
    }, [allUsers]);

    useEffect(() => {
        const getListOfHobbies = async () => {
            const hobbies = await generateHobbiesInfo('en');
            setListOfHobbies(hobbies);
        };
        getListOfHobbies();
    }, []);

    return (
        <Paper elevation={3} style={{ width: "23%", padding: 20, position: 'fixed', top: 0, marginTop: 30 }}>
            <Typography variant="h6" gutterBottom>Filters</Typography>
            <Divider />
            <FormControl fullWidth sx={{ my: 1 }}>
                <Typography variant="body1">Age</Typography>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {Object.values(AgeRange).map(age => (
                        <Button
                            className={filterOptions.age.includes(age) ? `bg-secondary` : "bg-gray-100 border-gray-200 text-gray-800"}
                            key={age}
                            variant={"contained"}
                            onClick={() => {
                                if (filterOptions.age) {
                                    if (Array.isArray(filterOptions.age)) {
                                        // If filterOptions.age is already an array, toggle the selection
                                        const updatedAge = filterOptions.age.includes(age)
                                            ? filterOptions.age.filter(selectedAge => selectedAge !== age)
                                            : filterOptions.age.concat(age);
                                        setFilterOptions({ ...filterOptions, age: updatedAge as AgeRange[] });
                                    } else {
                                        // If filterOptions.age is not an array, initialize it as an array with the selected age
                                        setFilterOptions({ ...filterOptions, age: [filterOptions.age, age] });
                                    }
                                } else {
                                    // If filterOptions.age is not set, initialize it as an array with the selected age
                                    setFilterOptions({ ...filterOptions, age: [age] as AgeRange[] });
                                }


                            }}
                            sx={{ marginY: 0.5, marginX: 0.5, minWidth: 'auto', textTransform: 'capitalize' }}
                        >
                            {age}
                        </Button>
                    ))}
                </div>
            </FormControl>
            <FormGroup sx={{ my: 1 }}>
                <Typography variant="body1">Country</Typography>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {uniqueCountries.map(country => (
                        <Button
                            key={country}
                            className={filterOptions.country.includes(country) ? `bg-secondary` : "bg-gray-100 border-gray-200 text-gray-800"}
                            variant={filterOptions.country.includes(country) ? "contained" : "outlined"}
                            onClick={() => {
                                if (filterOptions.country) {
                                    if (Array.isArray(filterOptions.country)) {
                                        const updatedCountry = filterOptions.country.includes(country)
                                            ? filterOptions.country.filter(selectedCountry => selectedCountry !== country)
                                            : filterOptions.country.concat(country);
                                        setFilterOptions({ ...filterOptions, country: updatedCountry });
                                    } else {
                                        setFilterOptions({ ...filterOptions, country: [filterOptions.country, country] });
                                    }
                                } else {
                                    setFilterOptions({ ...filterOptions, country: [country] });
                                }

                            }}
                            sx={{ marginY: 0.5, marginX: 0.5, minWidth: 'auto', textTransform: 'capitalize' }}
                        >
                            {country}
                        </Button>
                    ))}
                </div>
            </FormGroup>
            <FormGroup sx={{ my: 1 }}>
                <Typography variant="body1">Gender</Typography>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {Object.values(GenderOptions).map(gender => (
                        <Button
                            className={filterOptions.gender.includes(gender) ? `bg-secondary` : "bg-gray-100 border-gray-200 text-gray-800"}
                            key={gender}
                            variant={"contained"}
                            onClick={() => {
                                if (filterOptions.gender) {
                                    if (Array.isArray(filterOptions.gender)) {
                                        const updatedGender = filterOptions.gender.includes(gender)
                                            ? filterOptions.gender.filter(selectedGender => selectedGender !== gender)
                                            : filterOptions.gender.concat(gender);
                                        setFilterOptions({ ...filterOptions, gender: updatedGender as GenderOptions[] });
                                    } else {
                                        setFilterOptions({ ...filterOptions, gender: [filterOptions.gender, gender] });
                                    }
                                } else {
                                    setFilterOptions({ ...filterOptions, gender: [gender] as GenderOptions[] });
                                }


                            }}
                            sx={{ marginY: 0.5, marginX: 0.5, minWidth: 'auto', textTransform: 'capitalize' }}
                        >
                            {gender}
                        </Button>


                    ))}
                </div>
            </FormGroup>
            <FormGroup sx={{ my: 1 }}>
                <Typography variant="body1">Hobbies</Typography>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {listOfHobbies.map(hobby => (
                        <Button
                            className={filterOptions.hobbies.map(h => h.code).includes(hobby.code) ? `bg-secondary` : "bg-gray-100 border-gray-200 text-gray-800"}
                            key={hobby.code}
                            variant={filterOptions.hobbies.map(h => h.code).includes(hobby.code) ? "contained" : "outlined"}
                            onClick={() => {
                                const checkedHobbies = [...filterOptions.hobbies];
                                const index = checkedHobbies.findIndex(h => h.code === hobby.code);
                                if (index !== -1) {
                                    checkedHobbies.splice(index, 1);
                                } else {
                                    checkedHobbies.push(hobby);
                                }
                                setFilterOptions({ ...filterOptions, hobbies: checkedHobbies });
                            }}
                            sx={{ marginY: 0.5, marginX: 0.1, minWidth: 'auto', textTransform: 'capitalize' }}
                        >
                            {hobby.name}
                        </Button>
                    ))}
                </div>
            </FormGroup>
        </Paper>
    );
};

export default Sidebar;

