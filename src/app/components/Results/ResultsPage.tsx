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
import SecondSectionAnswers from "./SecondSectionAnswers";
import OpenQuestionsAnswers from "./OpenQuestionsAnswers";

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
            const response = await fetch('/results-1.json');
            const data = await response.json();

            //count how many user have answer the questionnaires and how many users in total and how many have answer the ai or real question
            let count = 0;
            let countAiOrReal = 0;
            data.forEach((user: User) => {
                if (user.questionnaireAnswers) {
                    count++;
                }
                if (user.aiOrReal) {
                    countAiOrReal++;
                }
            });
            console.log("Questionnaires answered", count);
            console.log("Ai or Real answered", countAiOrReal);
            //total
            console.log("Total users", data.length);

            //now how many users have answer the 9 and 10th optional questions
            let countOptional9 = 0;
            let countOptional10 = 0;
            data.forEach((user: User) => {
                if (user.questionnaireAnswers) {

                    if (user.questionnaireAnswers && user.questionnaireAnswers[9]?.answer && (user.questionnaireAnswers[9].answer != "" || user.questionnaireAnswers[9].answer.length < 2)) {
                        countOptional9++;
                    }
                    if (user.questionnaireAnswers && user.questionnaireAnswers[10]?.answer && (user.questionnaireAnswers[10].answer != "" || user.questionnaireAnswers[10].answer.length < 2)) {
                        countOptional10++;
                    }
                }
            });
            console.log("Optional 9 answered", countOptional9);
            console.log("Optional 10 answered", countOptional10);

            //print if the user have ever user instagram for peple over 31 and around 19 and 30
            let countInstagram = 0;
            let countInstagram19 = 0;
            let countInstagram31 = 0;
            data.forEach((user: User) => {
                if (user.questionnaireAnswers) {
                    if (user.isInstagramUser) {
                        countInstagram++;
                    }
                    if (user.ageRange == "19-30" && user.isInstagramUser) {
                        countInstagram19++;
                    }
                    if ((user.ageRange == "31-50" || user.ageRange == "51-65") && user.isInstagramUser) {
                        countInstagram31++;
                    }
                }
            });
            console.log("Instagram users", countInstagram);
            console.log("Instagram users 19-30", countInstagram19);
            console.log("Instagram users 31-50", countInstagram31);


            /*const response = await getAllUsers();
            const data = await response;*/
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

                    <SecondSectionAnswers filteredUsers={filteredUsers} />

                    <OpenQuestionsAnswers filteredUsers={filteredUsers} />

                </Grid>
            </Grid>


        </div>
    );
};

export default ResultsPage;
