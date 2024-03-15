import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode, Key } from "react";
import { BiMessageRounded } from "react-icons/bi";
import { FiHeart, FiSend } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import Image from "next/image";
import { AdComponents } from "@/app/types/types";

type DisplayAdProps = {
    setup: AdComponents;
    images: string;
};

const DisplayAd = ({ setup, images }: DisplayAdProps) => {
    return (
        <div className="max-w-full relative h-full w-full">
            <div className="max-w-md relative h-full mx-auto">

                <div className="items-center flex place-content-center">
                    <section className="flex flex-col py-4 items-center w-fit bg-black border-y-8 border-black">
                        <div className="flex flex-row space-x-4 w-42 ">
                            <div style={{ width: `${320}px`, height: `${320}px`, }} className="relative bg-slate-800 flex flex-row">
                                {images &&
                                    <Image src={images} width={1024} height={1024} alt="background"
                                        className="absolute w-full h-full object-contain" />
                                }

                                {/* Text */}
                                {setup.text.map((text, text_index) => (
                                    <p key={text_index} className="absolute w-fit h-fit"
                                        style={{
                                            top: `${text.position.y * (320 / 1080)}px`,
                                            left: `${text.position.x * (300 / 1080)}px`,
                                            fontSize: `${text.fontSize * 0.8}px`,
                                            color: `${text.color}`,
                                            fontFamily: `${text.font}`,
                                            textAlign: text.align as any,
                                            fontStyle: `${text.style}`,
                                            fontWeight: `${text.weight}`,
                                            letterSpacing: `${text.letterSpacing}px`,
                                            lineHeight: `${text.lineHeight * (1080 / 320)}px`,
                                            backgroundColor: `${text.background_color}${Math.round(text.background_opacity * 255).toString(16).padStart(2, '0')}`,
                                            opacity: 1,
                                            zIndex: 20,
                                            width: `${text.width ? text.width : 320}px`,
                                        }}>
                                        {text.content}</p>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-row w-[320px] items-center h-8 bg-black px-3 text-sm font-medium justify-between"
                            style={{
                                color: setup.footer?.color,
                                background: setup.footer?.background_color
                            }}>
                            {setup.footer?.content}
                            <IoIosArrowForward size={24} />
                        </div>
                        <div className="flex flex-row w-[320px] justify-between h-10 bg-black px-3 py-3">
                            <div className="flex flex-row space-x-3">
                                <FiHeart size={24} className=" text-white" />
                                <BiMessageRounded size={26} className=" fill-white" />
                                <FiSend size={24} className=" text-white" />

                            </div>
                        </div>
                        <div className="flex flex-row w-[320px] justify-between h-5 bg-black text-white text-sm px-3 pt-1">
                            {`100 likes`}
                        </div>
                        <div className="flex flex-row w-[320px] h-36 bg-black pt-1 pb-1">
                            <label className="text-white text-sm text-justify px-3 line-clamp-7">
                                <span className="font-semibold text-transparent">{"HelloThere"}  </span>
                                {`${setup.post_caption}`}
                            </label>
                        </div>
                    </section>
                </div >
            </div>
        </div>
    );
};

export default DisplayAd;