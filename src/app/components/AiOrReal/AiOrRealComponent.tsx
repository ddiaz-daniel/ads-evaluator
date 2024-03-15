"use client";
import { getAllGeneratedAds } from "@/app/utils/firebase/funtions";
import { useEffect, useState } from "react";

import { CircularProgress } from "@mui/material";
import DisplayAd from "./DisplayAd";
import { Ad, AdComponents } from "@/app/types/types";

const AiOrRealComponent = () => {
    const [ads, setAds] = useState<Ad[]>([]);
    const [page, setPage] = useState(0);
    const [setups, setSetups] = useState<AdComponents[]>([]);
    const [images, setImages] = useState<string[]>([]);

    const handleFakeClick = () => {
        const id = ads[page].id;
        console.log(id);
        setPage(page + 1);
    };

    const handleAiClick = () => {
        const id = ads[page].id;
        console.log(id);
        setPage(page + 1);
    };


    useEffect(() => {
        const getAds = async () => {
            const ads = await getAllGeneratedAds();
            setAds(ads);
        };
        getAds();
    }, []);

    useEffect(() => {
        let listOfSetups: AdComponents[] = [];
        let listOfImages: string[] = [];
        ads.map(ad => {
            listOfSetups.push(ad.setup.ads[0].data);
            listOfImages.push(ad.images[0]);

        });
        setSetups(listOfSetups);
        setImages(listOfImages);

    }, [ads]);

    if (!ads || !setups.length || !images.length) {
        return <div className="w-screen h-screen flex place-content-center items-center"><CircularProgress /></div>;
    }

    return (
        <section className="max-w-screen mx-auto relative h-full min-h-screen pt-4 px-8">
            {ads.map((ad, index) => (
                <div key={index}>
                    {page === index && (
                        <>
                            <div className="mb-4 h-full">
                                <h1 className="text-4xl w-full pt-8 pb-4 border-b-2 border-white/50 border-dashed">
                                    <span className="text-4xl text-secondary">{page}</span>
                                    <span className="text-2xl">/10</span>
                                </h1>
                            </div>
                            <DisplayAd setup={setups[index]} images={images[index]} />
                        </>
                    )}
                </div>
            ))}



            <div className=" h-full flex flex-row py-8">
                <button type="button" onClick={handleFakeClick} className="p-3 bg-secondary rounded w-full text-center mx-2 text-xl" >
                    {"Fake"}
                </button>
                <button type="button" onClick={handleAiClick} className="p-3 bg-secondary rounded w-full text-center mx-2 text-xl" >
                    {"Ai"}
                </button>
            </div>

        </section>

    );
};

export default AiOrRealComponent;