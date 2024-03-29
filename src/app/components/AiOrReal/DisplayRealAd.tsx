import { BiMessageRounded } from 'react-icons/bi';
import { FiHeart, FiSend } from 'react-icons/fi';
import { IoIosArrowForward } from 'react-icons/io';
import Image from 'next/image';
import { RealSetup } from '@/app/types/types';
import React from 'react';

type DisplayRealAdProps = {
  setup: RealSetup;
  images: string;
  locale: "en" | "fr" | "de" | "es" | "pt" | "it";
};

const DisplayRealAd = ({ setup, images, locale }: DisplayRealAdProps) => {

  const splitDescription = setup.description[locale].split('\n');

  return (
    <div className="relative h-full w-full max-w-full overflow-y-auto">
      <div className="relative mx-auto h-full max-w-md">
        <div className="flex place-content-center items-center">
          <section className="flex w-fit flex-col items-center border-y-8 border-black bg-black pb-4 h-[640px] overflow-y-scroll">
            <div className="w-42 flex flex-row space-x-4 ">
              <div
                style={{ width: `${320}px`, height: `${320}px` }}
                className="relative flex flex-row bg-slate-800"
              >
                {images && (
                  <Image
                    src={images}
                    width={1024}
                    height={1024}
                    alt="background"
                    className="absolute h-full w-full object-contain"
                  />
                )}

                {/* Text */}
                {setup.labels.map((text, text_index) => (
                  <p
                    key={text_index}
                    className="absolute h-fit w-fit"
                    style={{
                      top: `${text.position.y}px`,
                      left: `${text.position.x}px`,
                      fontSize: `${text.fontSize}px`,
                      color: `${text.fontColor ? text.fontColor : 'white'}`,
                      fontFamily: `arial, sans-serif`,
                      textAlign: 'center',
                      fontStyle: `normal`,
                      fontWeight: `${text.fontWeight}`,
                      letterSpacing: `normal`,
                      lineHeight: `normal`,
                      backgroundColor: `transparent`,
                      opacity: 1,
                      zIndex: 20,
                      width: `320px`,
                      padding: `0px 2px`,
                    }}
                  >
                    {text.text[locale]}
                  </p>
                ))}
              </div>
            </div>
            <div
              className="flex h-10 w-[300px] flex-row items-center justify-between bg-black text-sm font-semibold border-b-[1px] border-gray-500/80"
            >
              {setup.footer[locale]}
              <IoIosArrowForward size={22} />
            </div>
            <div className="flex h-10 w-[320px] flex-row justify-between bg-black px-3 py-3">
              <div className="flex flex-row space-x-3">
                <FiHeart size={22} className=" text-white" />
                <BiMessageRounded size={26} className=" fill-white" />
                <FiSend size={24} className=" text-white" />
              </div>
            </div>
            <div className="flex h-5 w-[320px] flex-row justify-between bg-black px-2 pt-1 text-sm text-white">
              {`100 likes`}
            </div>
            <div className="flex min-h-36 w-[320px] flex-row bg-black pt-1">
              <label className="line-clamp-7 pl-2 pr-1  text-start text-sm font-light text-white">
                <strong>
                  {'InstaAds'}{' '}
                </strong>
                {splitDescription.map((line, index) => (
                  <span key={index}>{line}
                    <br /></span>
                ))
                }
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DisplayRealAd;
