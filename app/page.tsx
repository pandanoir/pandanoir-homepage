import Image from 'next/image';

const Home = () => (
  <div
    className={`grid w-screen h-screen
      before:content-[''] before:bg-black before:opacity-50 before:row-start-1 before:col-start-[-1]`}
  >
    <div className="row-start-1 col-start-[-1] flex justify-center items-center">
      <Image
        src="/logo-black.png"
        alt=""
        width="512"
        height="512"
        className="flex-none max-w-full max-h-full rounded-full"
      />
    </div>
    <div className="z-10 flex flex-col text-center justify-center items-center row-start-1 col-start-[-1]">
      <h2 className="flex-none text-6xl font-serif font-bold">pandanoir</h2>
    </div>
  </div>
);
export default Home;
