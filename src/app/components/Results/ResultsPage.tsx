"use client";
import { generateHobbiesInfo } from "@/app/types/hobbies";
import { AiOrRealAnswers, User, GenderOptions, AgeRange, HobbiesInfo } from "@/app/types/types";
import { getAllUsers } from "@/app/utils/firebase/functions";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Grid, Typography } from "@mui/material";
import Overview from "./Overview";
import FilterSidebar from "./FilterSidebar";
import FirstSectionAnswers from "./FirstSectionAnswers";

export type FilterOptions = {
    age: AgeRange | '' | AgeRange[],
    country: '' | string[],
    gender: GenderOptions | '' | GenderOptions[],
    hobbies: HobbiesInfo[];
};
const ResultsPage = () => {
    const allAges: AgeRange[] = Object.values(AgeRange);
    const allGenderOptions: GenderOptions[] = Object.values(GenderOptions);

    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>(
        {
            age: allAges,
            country: '',
            gender: allGenderOptions,
            hobbies: [],
        }
    );

    useEffect(() => {
        const getData = async () => {
            //const response = await fetch('/results-2.json');
            //const data = await response.json();


            const response = await getAllUsers();
            const data = await response;
            /*   
               // Save this data locally as json
               const json = JSON.stringify(data);
               const blob = new Blob([json], { type: 'application/json' });
               const url = URL.createObjectURL(blob);
               const a = document.createElement('a');
               
               a.href = url;
               a.download = 'results-1.json';
               document.body.appendChild(a);
               a.click();
               document.body.removeChild(a);
           */
            setAllUsers(data);
        };
        getData();
    }, []);

    if (!allUsers) {
        return (<p>Loading ...</p>);
    }

    return (
        <div className=" bg-slate-800 p-8 overflow-x-hidden text-white relative">
            <Typography variant="h3" className="w-screen text-center text-white">Results</Typography>
            <Grid container spacing={2}>
                <Grid item xs={3} sm={3} md={3}>
                    <FilterSidebar allUsers={allUsers} filteredUsers={filteredUsers} setFilteredUsers={setFilteredUsers} filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
                </Grid>
                <Grid item xs={9} sm={9} md={9}>

                    <Overview users={filteredUsers} />

                    <FirstSectionAnswers filteredUsers={filteredUsers} />

                </Grid>
            </Grid>


        </div>
    );
};

export default ResultsPage;
