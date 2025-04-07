import Features from "@/components/Home/Features";
import Footer from "@/components/Home/Footer";
import Thumbnail from "@/components/Home/Thumbnail";

export default function Home() {
  return (
    <div>
      <div className="bg-[url('/nft.webp')]  bg-cover bg-center bg-no-repeat">
        <div className="flex flex-col max-w-[1440px] mx-auto px-4 pb-7">
          <Thumbnail />
        </div>
      </div>
      <div className="bg-[url('/Features.jpg')]  bg-cover  bg-no-repeat">
        <div className="flex flex-col max-w-[1440px] mx-auto px-4 py-4">
          <Features />
        </div>
      </div>
      <div className="bg-gradient-to-tr from-button-gradient-start to-button-gradient-end">
        <div className="flex flex-col max-w-[1440px] mx-auto px-4 py-4">
          <Footer />
        </div>
      </div>
    </div>
  );
}
