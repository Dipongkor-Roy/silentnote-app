import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { BorderBeam } from "../border-beam";

export function HeroVideoDialogDemo() {
  return (
    <div className="relative">
      <BorderBeam/>
      <HeroVideoDialog
        className="block dark:hidden p-1 "
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/KDwKsN2qsag?si=UZGXVqpFd66ySE2Y"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
        thumbnailAlt="Hero Video"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/KDwKsN2qsag?si=UZGXVqpFd66ySE2Y"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
        thumbnailAlt="Hero Video"
      />
    </div>
  );
}
