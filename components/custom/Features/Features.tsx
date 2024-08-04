import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link';

const ProjectsData = [
  {
    id: 1,
    name: 'SilentNote',
    description: 'A platform for collecting anonymous messages effortlessly.',
    link: '',
    image: 'https://ansubkhan.com/images/projects/syntaxUI.svg',
  },
  {
    id: 2,
    name: 'Prettyfolio',
    description: 'A curated collection of portfolios for inspiration.',
    link: 'https://prettyfolio.com',
    image: 'https://ansubkhan.com/images/projects/prettyfolio.png',
  },
  {
    id: 3,
    name: 'Enchant',
    description: 'A vibrant theme for Visual Studio Code.',
    link: '',
    image: 'https://ansubkhan.com/images/projects/enchant.png',
  },
  {
    id: 5,
    name: 'Quote Vault',
    description: 'Social media, but for sharing quotes.',
    link: 'https://quote-vault.vercel.app',
    image: 'https://ansubkhan.com/images/projects/quote-vault.png',
  },
];


const Features = () => {
  return (
    <div>
      <h2 className="text-sm text-center font-medium pb-6 sm:mb-2">Key Features</h2>
      <div className='px-5 justify-center items-center'>
      <div className="grid w-full grid-cols-2 gap-x-10 md:grid-cols-3">
        {ProjectsData.map((project) => {
          return (
            <motion.div
              whileHover={{
                y: -8,
              }}
              transition={{
                type: 'spring',
                bounce: 0.7,
              }}
              key={project.id}
              className="mt-5 text-left p-2"
            >
              <Link target="_blank" rel="noopener noreferrer" href={project.link}>
                <Image
                  src={project.image}
                  width={30}
                  height={30}
                  className="mb-3 rounded-lg border-gray-400 dark:border"
                  alt={project.name}
                />
                <div className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {project.name}
                </div>
                <div className="max-w-[250px] text-sm font-normal text-gray-500 dark:text-gray-500">
                  {project.description}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
      </div>
    </div>
  )
}

export default Features