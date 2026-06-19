export function Shape() {
  return (
    <div
      style={{ clipPath: "polygon(0 0 ,100% 0 ,20% 100% ,0% 100%)" }}
      className={` start-0 fixed z-0 top-0 w-[max(6vw,calc((50vw_-_500px)/2))] h-[100vh] bg-black hidden lg:block dark:hidden `}></div>
  );
}
// style={{ clipPath: lang == langs.en ? "polygon(0 0, 100% 0, 0% 100%)" : "polygon( 0 0,100% 0, 100% 100%)" }}
// ${lang == langs.en ? " start-0 " : " end-0 "}
