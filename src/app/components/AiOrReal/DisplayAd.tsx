import { BiMessageRounded } from 'react-icons/bi';
import { FiHeart, FiSend } from 'react-icons/fi';
import { IoIosArrowForward } from 'react-icons/io';
import Image from 'next/image';
import { AdComponents } from '@/app/types/types';

type DisplayAdProps = {
  setup: AdComponents;
  images: string;
  locale: 'en' | 'fr' | 'de' | 'es' | 'pt' | 'it';
};

const DisplayAd = ({ setup, images, locale }: DisplayAdProps) => {
  return (
    <div className="relative w-full max-w-full">
      <div className="relative mx-auto max-w-md">
        <div className="flex place-content-center items-center">
          <section className="flex h-[630px] w-fit flex-col items-center overflow-x-hidden overflow-y-scroll border-y-8 border-black bg-black pb-4">
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
                {setup.text.map((text, text_index) => (
                  <p
                    key={text_index}
                    className="absolute h-fit w-fit"
                    style={{
                      top: `${text.position.y * (320 / 1080)}px`,
                      left: `${text.position.x * (300 / 1080)}px`,
                      fontSize: `${text.fontSize * 0.8}px`,
                      color: `${text.color}`,
                      fontFamily: `${text.font}`,
                      textAlign: text.align as
                        | 'center'
                        | 'left'
                        | 'right'
                        | 'justify',
                      fontStyle: `${text.style}`,
                      fontWeight: `${text.weight}`,
                      letterSpacing: `${text.letterSpacing}px`,
                      lineHeight: `${text.lineHeight * (1080 / 320)}px`,
                      backgroundColor: `${text.background_color}${Math.round(
                        text.background_opacity * 255
                      )
                        .toString(16)
                        .padStart(2, '0')}`,
                      opacity: 1,
                      zIndex: 20,
                      width: `${text.width ? text.width : 320}px`,
                    }}
                  >
                    {text.content[locale]}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex h-10 w-[300px] flex-row items-center justify-between border-b-[1px] border-gray-500/80 bg-black text-sm font-semibold">
              {setup.footer?.content[locale]}
              <IoIosArrowForward size={22} />
            </div>
            <div className="flex h-10 w-[320px] flex-row justify-between bg-black px-3 py-3">
              <div className="flex flex-row space-x-3">
                <FiHeart size={22} className=" text-white" />
                <BiMessageRounded size={26} className=" fill-white" />
                <FiSend size={24} className=" text-white" />
              </div>
            </div>
            <div className="flex h-5 w-[320px] flex-row justify-between bg-black px-3 pt-1 text-sm text-white">
              {`100 likes`}
            </div>
            <div className="flex h-36 w-[320px] flex-row bg-black pb-1 pt-1">
              <label className="line-clamp-7 px-3 text-start text-sm text-white">
                <span className="font-semibold ">{'InstaAds'} </span>
                {`${setup.post_caption[locale]}`}
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DisplayAd;
