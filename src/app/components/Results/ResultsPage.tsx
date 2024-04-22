"use client";
import { generateHobbiesInfo } from "@/app/types/hobbies";
import { AiOrRealAnswers, User, GenderOptions, AgeRange, HobbiesInfo } from "@/app/types/types";
import { getAllUsers } from "@/app/utils/firebase/functions";
import { useEffect, useState } from "react";
import Image from "next/image";

const ResultsPage = () => {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [filterOptions, setFilterOptions] = useState({
        age: '' as AgeRange | '',
        country: '',
        gender: '' as GenderOptions | '',
        hobbies: [] as HobbiesInfo[]
    });
    const [listOfHobbies, setListOfHobbies] = useState<HobbiesInfo[]>([]);

    useEffect(() => {
        const getData = async () => {
            const response = await fetch('/results-1.json');
            const data = await response.json();
            setAllUsers(data);
        };
        getData();
    }, []);

    useEffect(() => {
        const getListOfHobbies = async () => {
            const hobbies = await generateHobbiesInfo('en');
            setListOfHobbies(hobbies);
        };
        getListOfHobbies();
    }, []);

    useEffect(() => {
        // Filter users based on filterOptions
        const filtered = allUsers.filter(user => {
            if (filterOptions.age && user.ageRange !== filterOptions.age) {
                return false;
            }
            if (filterOptions.country && user.country !== filterOptions.country) {
                return false;
            }
            if (filterOptions.gender && user.gender !== filterOptions.gender) {
                return false;
            }
            if (filterOptions.hobbies.length > 0 && !user.hobbies?.some(hobby => filterOptions.hobbies.map(h => h.code).includes(hobby))) {
                return false;
            }
            return true;
        });
        setFilteredUsers(filtered);
    }, [allUsers, filterOptions]);

    const getAIRealGroupedById = () => {
        const groupedById: Record<string, { real: number; ai: number; }> = {};

        // Loop through each user
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
            <table className="border-collapse border border-gray-400">
                <thead>
                    <tr>
                        <th className="p-3 border border-gray-400">Ad Image</th>
                        <th className="p-3 border border-gray-400">Real (%)</th>
                        <th className="p-3 border border-gray-400">AI (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(groupedById).map(([id, counts]) => (
                        <tr key={id} className="border border-gray-400">
                            <td className="p-3 border border-gray-400"><Image width={300} height={300} src={`/images/${id}.jpg`} alt={`Ad ${id}`} /></td>
                            <td className={`p-3 border border-gray-400 ${counts.real > 0 ? 'bg-green-200' : ''}`}>{(counts.real / (counts.real + counts.ai) * 100).toFixed(2)}</td>
                            <td className={`p-3 border border-gray-400 ${counts.ai > 0 ? 'bg-green-200' : ''}`}>{(counts.ai / (counts.real + counts.ai) * 100).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderOverviewTable = () => {
        const groupedById = getAIRealGroupedById();
        let positives = 0;
        let falsePositives = 0;
        let others = 0;

        Object.entries(groupedById).forEach(([id, counts]) => {
            if (id.startsWith("100")) {
                positives += counts.real;
            } else if (counts.ai > 0) {
                falsePositives += counts.ai;
            } else {
                others += counts.real;
            }
        });

        return (
            <table className="border-collapse border border-gray-400">
                <thead>
                    <tr>
                        <th className="p-3 border border-gray-400">Category</th>
                        <th className="p-3 border border-gray-400">Count</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border border-gray-400">
                        <td className="p-3 border border-gray-400">Positives (Real)</td>
                        <td className="p-3 border border-gray-400">{positives}</td>
                    </tr>
                    <tr className="border border-gray-400">
                        <td className="p-3 border border-gray-400">False Positives (AI)</td>
                        <td className="p-3 border border-gray-400">{falsePositives}</td>
                    </tr>
                    <tr className="border border-gray-400">
                        <td className="p-3 border border-gray-400">Others</td>
                        <td className="p-3 border border-gray-400">{others}</td>
                    </tr>
                </tbody>
            </table>
        );
    };

    if (!allUsers) {
        return (<p>Loading ...</p>);
    }

    return (
        <div>
            <h1>Results</h1>
            <div>
                <label htmlFor="age">Age:</label>
                <select id="age" value={filterOptions.age} onChange={(e) => setFilterOptions({ ...filterOptions, age: e.target.value as AgeRange })}>
                    <option value="">All</option>
                    {Object.values(AgeRange).map(age => (
                        <option key={age} value={age}>{age}</option>
                    ))}
                </select>
                <label htmlFor="country">Country:</label>
                <input type="text" id="country" value={filterOptions.country} onChange={(e) => setFilterOptions({ ...filterOptions, country: e.target.value })} />
                <div>
                    <span>Gender:</span>
                    {Object.values(GenderOptions).map(gender => (
                        <label key={gender}>
                            <input type="radio" name="gender" value={gender} checked={filterOptions.gender === gender} onChange={(e) => setFilterOptions({ ...filterOptions, gender: e.target.value as GenderOptions })} />
                            {gender}
                        </label>
                    ))}
                </div>
                <div>
                    <span>Hobbies:</span>
                    {listOfHobbies.map(hobby => (
                        <label key={hobby.code}>
                            <input type="checkbox" name="hobbies" value={hobby.code} checked={filterOptions.hobbies.map(h => h.code).includes(hobby.code)} onChange={(e) => {
                                const checkedHobbies = [...filterOptions.hobbies];
                                if (e.target.checked) {
                                    checkedHobbies.push(hobby);
                                } else {
                                    const index = checkedHobbies.findIndex(h => h.code === hobby.code);
                                    if (index !== -1) {
                                        checkedHobbies.splice(index, 1);
                                    }
                                }
                                setFilterOptions({ ...filterOptions, hobbies: checkedHobbies });
                            }} />
                            {hobby.name}
                        </label>
                    ))}
                </div>
            </div>
            {renderFilteredUsersTable()}
            <h2>Overview</h2>
            {renderOverviewTable()}
        </div>
    );
};

export default ResultsPage;
