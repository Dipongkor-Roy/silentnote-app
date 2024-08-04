import Image from 'next/image';
import { FC } from 'react';
import { BorderBeam } from '../border-beam';

const ImageFade: FC = () => {
  return (
    <>
       
    <div className='mx-5  rounded-md  '>
 
      <div className="p-1 relative flex max-w-6xl justify-center overflow-hidden rounded-md">
      <BorderBeam />
        <Image
          src="https://dashboardsdesign.com/img/dashboards/dashboard-05-custom.png"
          alt="hero-section"
          height={800} // Specify the height
          width={1300} // Specify the width
          className="h-full w-full rounded-lg object-cover md:w-[1300px]"
          style={{
            maskImage: `linear-gradient(to top, transparent, black 20%)`,
          }}
        />
      </div>
    </div>
    </>
  );
};

export default ImageFade;
