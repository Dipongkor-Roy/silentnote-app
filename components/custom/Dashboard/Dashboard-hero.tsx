import Image from 'next/image';
import { FC } from 'react';

const ImageFade: FC = () => {
  return (
    <div className='mx-7  rounded-md border-3 border-primary/10 bg-blue-100'>
      <div className="relative flex max-w-6xl justify-center overflow-hidden">
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
  );
};

export default ImageFade;
