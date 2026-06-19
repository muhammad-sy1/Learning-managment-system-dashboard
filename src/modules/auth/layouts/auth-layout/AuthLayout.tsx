import Logo from "@/../public/logo.svg";
import Image from "next/image";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`min-h-[100vh] flex flex-col lg:flex-row lg:justify-stretch
         w-full overflow-hidden relative gap-14 lg:gap-12 `}
    >
      <div
        className="transition  flex
            relative items-center justify-center basis-fit lg:basis-[50%] px-5 pt-14 lg:py-10
              "
      >
        <Image
          src={Logo}
          className={`w-[230px] h-[230px] max-w-[calc(100vw_-_50px)] max-h-[calc(100vw_-_50px)]
              lg:w-[calc((100vw_-_180px)/2)] lg:h-[calc((100vw_-_180px)/2)] object-contain
              lg:max-w-[min(800px,max(500px,calc((100vw_-_500px)/2)))] 
              lg:max-h-[min(800px,max(500px,calc((100vw_-_500px)/2)))]
              p-1 dark:p-2 dark:lg:p-4 
                rounded-full `}
          alt="logo"
        />
      </div>
      <div
        className="px-5 pb-16 lg:py-10
       relative z-20 w-full lg:w-[50%] flex items-center justify-center lg:justify-start max-w-full"
      >
        {children}
      </div>

      {/* <button onClick={() => setModeConfig(modes.dark)}>dark</button>
      <button onClick={() => setModeConfig(modes.light)}>dark</button> */}
    </div>
  );
}
// lg:bg-transparent
// lg:from-my-dark-white lg:to-transparent lg:to-[calc(50%_-_2.5rem)]
// ${lang == langs.ar ? "  lg:bg-gradient-to-l " : "  lg:bg-gradient-to-r "}
//  ${
//   lang == langs.ar
//     ? " lg:right-[calc((100%_-_40px)/4)] lg:translate-x-[50%]"
//     : " lg:left-[calc((100%_-_40px)/4)] lg:-translate-x-[50%]"
// }
// `}
